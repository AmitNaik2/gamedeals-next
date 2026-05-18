import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import 'dotenv/config';

// Create a mock users store (in a real app, this would be a DB like Firestore or Postgres)
const subscribedEmails = new Set<string>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    auth: {
      user: process.env.SMTP_USER || "test_user",
      pass: process.env.SMTP_PASS || "test_pass",
    },
  });

  async function verifyUrl(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout
      const res = await fetch(url, {
        method: "HEAD",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        signal: controller.signal as any
      });
      clearTimeout(timeoutId);
      // We accept 200s, 300s, and even 403s because stores often block bots but work for humans
      if (res.status >= 200 && res.status < 500 && res.status !== 404) {
        return true;
      }
      return false;
    } catch (e) {
      // Treat timeouts or fetch errors as failures, but timeout might just be slow store.
      return false;
    }
  }

  // Proxy the GamerPower API to avoid CORS and format data if needed
  app.get("/api/deals", async (req, res) => {
    try {
      const type = req.query.type as string;
      const url = type 
        ? `https://www.gamerpower.com/api/giveaways?type=${type}&sort-by=date`
        : `https://www.gamerpower.com/api/giveaways?sort-by=date`;
        
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (!response.ok) throw new Error("Failed to fetch deals");
      let data = await response.json();
      
      // Limit to items to avoid taking forever
      if (Array.isArray(data)) {
        // Filter trusted platforms FIRST
        const trustedPlatforms = ['steam', 'epic', 'xbox', 'playstation', 'ps4', 'ps5', 'origin', 'battle.net', 'ubisoft', 'ea', 'gog', 'pc', 'itch.io', 'nintendo'];
        data = data.filter((deal: any) => {
          if (!deal.platforms) return false;
          const plats = deal.platforms.toLowerCase();
          return trustedPlatforms.some(t => plats.includes(t));
        });
        
        // We skip verifyUrl because store anti-bot protections often fail the request and we drop valid deals.
        // data = verifiedData;
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  });

  // Proxy the GamerPower API for Loot/Promo codes
  app.get("/api/loot", async (req, res) => {
    try {
      const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" };
      
      let data: any[] = [];
      const resLoot = await fetch("https://www.gamerpower.com/api/giveaways?type=loot", { headers });
      
      if (resLoot.ok) {
        data = await resLoot.json();
      }
      
      const { search } = req.query;
      if (search && typeof search === 'string') {
        const query = search.toLowerCase();
        data = data.filter((item: any) => 
          (item.title && item.title.toLowerCase().includes(query)) || 
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.instructions && item.instructions.toLowerCase().includes(query))
        );
      }
      
      // Limit to max items
      if (Array.isArray(data)) {
        // Sort by id descending as a rough proxy for newest
        data.sort((a, b) => b.id - a.id);
        data = data.slice(0, 50);
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching loot:", error);
      res.status(500).json({ error: "Failed to fetch loot" });
    }
  });

  // Proxy the CheapShark API
  app.get("/api/cheapshark-deals", async (req, res) => {
    try {
      const response = await fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1,2,3,7,8,11,13&sortBy=DealRating&onSale=1", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (!response.ok) {
        console.error("Cheapshark bad status:", response.status, response.statusText);
        throw new Error("Failed to fetch cheapshark deals");
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching cheapshark deals:", error);
      res.status(500).json({ error: "Failed to fetch cheapshark deals" });
    }
  });

  // Token management for Twitch/IGDB
  let twitchAccessToken = "";
  let tokenExpiration = 0;

  async function getTwitchToken(): Promise<string | null> {
    if (twitchAccessToken && Date.now() < tokenExpiration) return twitchAccessToken;
    
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) return null;
    
    try {
      const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch token");
      twitchAccessToken = data.access_token;
      tokenExpiration = Date.now() + (data.expires_in * 1000) - 60000;
      return twitchAccessToken;
    } catch (error) {
      console.error("Failed to fetch Twitch token:", error);
      return null;
    }
  }

  const igdbQueue: Array<{
    title: string,
    resolve: (value: any) => void,
    reject: (reason?: any) => void
  }> = [];

  let isProcessingIgdbQueue = false;
  const igdbCache = new Map<string, any>();

  async function processIgdbQueue() {
    if (isProcessingIgdbQueue) return;
    isProcessingIgdbQueue = true;

    while (igdbQueue.length > 0) {
      const task = igdbQueue.shift();
      if (task) {
        try {
          const result = await fetchIgdbData(task.title);
          igdbCache.set(task.title.toLowerCase(), result);
          task.resolve(result);
        } catch (err) {
          task.reject(err);
        }
        
        // Wait 250ms to ensure max 4 requests per second
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }

    isProcessingIgdbQueue = false;
  }

  async function fetchIgdbData(title: string) {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const token = await getTwitchToken();

    if (!clientId || !token) throw new Error("TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET not configured");

    let cleanTitle = String(title)
      .replace(/\(.*?\)/g, '')
      .replace(/Giveaway/gi, '')
      .replace(/Free Weekend/gi, '')
      .replace(/Playtest/gi, '')
      .replace(/The/gi, '')
      .trim();

    cleanTitle = cleanTitle.replace(/"/g, '').replace(/:/g, '');

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      body: `search "${cleanTitle}"; fields name,rating,summary,cover.url,genres.name,platforms.name,url; limit 1;`
    });
    
    if (!response.ok) throw new Error("Failed to fetch from IGDB");
    const data = await response.json();
    
    if (data && data.length > 0) {
      if (data[0].cover && data[0].cover.url) {
        data[0].background_image = 'https:' + data[0].cover.url.replace('t_thumb', 't_1080p');
      }
      return data[0];
    } else {
      return { not_found: true };
    }
  }

  app.get("/api/igdb", async (req, res) => {
    try {
      const { title } = req.query;
      if (!title) return res.status(400).json({ error: "Missing title query parameter" });

      const titleStr = String(title).toLowerCase();
      if (igdbCache.has(titleStr)) {
        return res.json(igdbCache.get(titleStr));
      }

      const data = await new Promise((resolve, reject) => {
        igdbQueue.push({ title: String(title), resolve, reject });
        processIgdbQueue();
      });

      res.json(data);
    } catch (error: any) {
      console.error("Error fetching IGDB info:", error);
      res.status(500).json({ error: error.message || "Failed to fetch from IGDB" });
    }
  });

  // Query RAWG API for enhanced game info
  const rawgCache = new Map<string, any>();
  app.get("/api/rawg", async (req, res) => {
    try {
      const { title } = req.query;
      if (!title) return res.status(400).json({ error: "Missing title query parameter" });

      const rawgKey = process.env.RAWG_API_KEY;
      if (!rawgKey) return res.status(500).json({ error: "RAWG_API_KEY not configured" });

      const titleStr = String(title).toLowerCase();
      if (rawgCache.has(titleStr)) {
        return res.json(rawgCache.get(titleStr));
      }

      let cleanTitle = String(title)
        .replace(/\(.*?\)/g, '')
        .replace(/Giveaway/gi, '')
        .replace(/Playtest/gi, '')
        .trim();

      const encodedTitle = encodeURIComponent(cleanTitle);
      const response = await fetch(`https://api.rawg.io/api/games?search=${encodedTitle}&key=${rawgKey}&page_size=1`, {
        headers: {
          "User-Agent": "FreeGameTracker/1.0"
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch from RAWG");
      const data = await response.json();
      
      const result = data.results && data.results.length > 0 ? data.results[0] : { not_found: true };
      rawgCache.set(titleStr, result);
      res.json(result);
    } catch (error) {
      console.error("Error fetching RAWG data:", error);
      res.status(500).json({ error: "Failed to fetch RAWG data" });
    }
  });


  // Handle newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (subscribedEmails.has(email)) {
      return res.status(400).json({ error: "Email already subscribed" });
    }

    subscribedEmails.add(email);
    console.log(`Email subscribed: ${email}`);

    // Try sending a welcome email (don't block the response on failure)
    if (process.env.SMTP_HOST) {
      transporter.sendMail({
        from: process.env.SMTP_FROM || "GameDeals <no-reply@gamedeals.com>",
        to: email,
        subject: "Welcome to GameDeals!",
        text: "You have successfully subscribed to get live, free game deals!"
      }).catch(err => console.error("Failed to send welcome email:", err));
    }

    res.json({ message: "Subscribed successfully! Emails will be sent for new deals." });
  });

  // Share a deal
  app.post("/api/share", async (req, res) => {
    const { email, dealTitle, dealUrl } = req.body;

    if (!email || !dealTitle || !dealUrl) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    console.log(`Sharing deal "${dealTitle}" to ${email}`);

    try {
      if (process.env.SMTP_HOST) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "GameDeals <no-reply@gamedeals.com>",
          to: email,
          subject: `Check out this free game deal: ${dealTitle}`,
          text: `Don't miss this free game deal!\n\n${dealTitle}\nGet it here: ${dealUrl}\n\nShared via GameDeals.`
        });
      } else {
        // Just simulate success if no real SMTP is available
        console.log("No SMTP Config: Simulated sending email log.");
      }
      res.json({ message: "Deal shared successfully!" });
    } catch (error) {
      console.error("Error sending share email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Web Crawler for Gaming News using cheerio
  const newsCache = {
    data: null as any[] | null,
    timestamp: 0
  };

  app.get("/api/news", async (req, res) => {
    try {
      // Return cached news if less than 30 mins old
      if (newsCache.data && Date.now() - newsCache.timestamp < 1800000) {
        return res.json(newsCache.data);
      }

      const cheerio = await import('cheerio');
      const news: any[] = [];
      let currentId = 0;

      const [pcGamerRes, rpsRes] = await Promise.allSettled([
        fetch("https://www.pcgamer.com/news/"),
        fetch("https://www.rockpapershotgun.com/latest")
      ]);
      
      if (pcGamerRes.status === 'fulfilled' && pcGamerRes.value.ok) {
        const html = await pcGamerRes.value.text();
        const $ = cheerio.load(html);
        
        $('.listingResult').slice(0, 3).each((i, el) => {
          const title = $(el).find('.article-name').text().trim();
          const link = $(el).find('a').attr('href');
          const time = $(el).find('time').text().replace('\n', '').trim() || "Recent";
          
          if (title && link) {
            news.push({ id: String(currentId++), title, link, time, type: "PC Gamer" });
          }
        });
      }

      if (rpsRes.status === 'fulfilled' && rpsRes.value.ok) {
        const html = await rpsRes.value.text();
        const $ = cheerio.load(html);
        
        $('.title').slice(0, 3).each((i, el) => {
          const title = $(el).text().trim();
          const href = $(el).find('a').attr('href');
          const link = href?.startsWith('http') ? href : `https://www.rockpapershotgun.com${href}`;
          
          if (title && link) {
            news.push({ id: String(currentId++), title, link, time: "Recent", type: "Rock Paper Shotgun" });
          }
        });
      }
      
      const finalNews = news.sort(() => Math.random() - 0.5).slice(0, 5);
      newsCache.data = finalNews;
      newsCache.timestamp = Date.now();
      
      res.json(finalNews);
    } catch (error: any) {
      console.error("Error crawling news:", error);
      res.status(500).json({ error: "Failed to crawl news" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static UI
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
