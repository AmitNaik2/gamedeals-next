// Vite import removed from the top level
import os from "os";
import express from "express";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import * as cheerio from "cheerio";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// Create a mock users store (in a real app, this would be a DB like Firestore or Postgres)
const subscribedEmails = new Set<string>();

function isActiveGiveaway(item: { end_date?: string; status?: string }) {
  if (item.status && item.status.toLowerCase() !== "active") return false;
  if (!item.end_date || item.end_date === "N/A") return true;

  const endStr = item.end_date.includes(" ") && !item.end_date.includes("Z") && !item.end_date.includes("GMT")
    ? item.end_date.replace(" ", "T") + "Z"
    : item.end_date;

  const endDate = new Date(endStr);
  if (Number.isNaN(endDate.getTime())) return true;

  return endDate.getTime() > Date.now();
}

const app = express();

// SEO Canonical Redirect: force www
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host === 'gamesdealshub.me') {
    return res.redirect(301, 'https://www.gamesdealshub.me' + req.originalUrl);
  }
  next();
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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
    if (!url || typeof url !== 'string' || !url.startsWith('http')) return false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
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

  async function fetchGamerPower(url: string) {
    const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      let response = await fetch(url, { headers, signal: controller.signal as any });
      clearTimeout(timeout);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      // Ignore initial errors to trigger fallback
    }
    
    // Fallback to proxy if GamerPower blocks Vercel IPs or times out
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
    const controllerProxy = new AbortController();
    const timeoutProxy = setTimeout(() => controllerProxy.abort(), 8000);
    const proxyRes = await fetch(proxyUrl, { signal: controllerProxy.signal as any });
    clearTimeout(timeoutProxy);
    
    if (!proxyRes.ok) throw new Error("Fallback proxy failed");
    return await proxyRes.json();
  }

  // Proxy the GamerPower API to avoid CORS and format data if needed
  app.get("/api/deals", async (req, res) => {
    try {
      const type = req.query.type as string;
      const url = type 
        ? `https://www.gamerpower.com/api/giveaways?type=${type}&sort-by=date`
        : `https://www.gamerpower.com/api/giveaways?sort-by=date`;
        
      let data = await fetchGamerPower(url);
      
      // Limit to items to avoid taking forever
      if (Array.isArray(data)) {
        // Filter trusted platforms FIRST
        const trustedPlatforms = ['steam', 'epic', 'xbox', 'playstation', 'ps4', 'ps5', 'origin', 'battle.net', 'ubisoft', 'ea', 'gog', 'pc', 'itch.io', 'nintendo'];
        data = data.filter((deal: any) => {
          if (!deal.platforms) return false;
          const plats = deal.platforms.toLowerCase();
          return isActiveGiveaway(deal) && trustedPlatforms.some(t => plats.includes(t));
        });
        
        // Real active verification for top 10 deals to discard dead links
        let verifiedDeals: any[] = [];
        const topDeals = data.slice(0, 10);
        await Promise.all(topDeals.map(async (deal) => {
            const urlToCheck = deal.open_giveaway_url || deal.open_giveaway;
            if (!urlToCheck) return;
            const isAlive = await verifyUrl(urlToCheck);
            if (isAlive) {
               verifiedDeals.push(deal);
            }
        }));
        
        // Combine verified top deals with the rest (unverified to save time)
        // Maintain relative order by sorting back their IDs or just using map
        const validTopIds = new Set(verifiedDeals.map(d => d.id));
        data = data.filter((deal: any, idx: number) => {
           if (idx < 10) return validTopIds.has(deal.id);
           return true; 
        });
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.json([]);
    }
  });

  // Proxy the GamerPower API for Loot/Promo codes
  app.get("/api/loot", async (req, res) => {
    try {
      let data: any[] = [];
      const url = "https://www.gamerpower.com/api/giveaways?type=loot";
      
      try {
        data = await fetchGamerPower(url);
      } catch (err) {
         // ignore
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
        data = data.filter(isActiveGiveaway);
        // Sort by id descending as a rough proxy for newest
        data.sort((a, b) => b.id - a.id);
        data = data.slice(0, 50);
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching loot:", error);
      res.json([]);
    }
  });

  async function fetchCheapshark(url: string) {
    const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      let response = await fetch(url, { headers, signal: controller.signal as any });
      clearTimeout(timeout);
      if (response.ok) {
        const text = await response.text();
        const json = JSON.parse(text);
        if (!json.error) return json;
      }
    } catch (err) {
      // Fallback
    }

    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
    const controllerProxy = new AbortController();
    const timeoutProxy = setTimeout(() => controllerProxy.abort(), 8000);
    const proxyRes = await fetch(proxyUrl, { signal: controllerProxy.signal as any });
    clearTimeout(timeoutProxy);
    
    if (!proxyRes.ok) throw new Error("Fallback proxy failed");
    return await proxyRes.json();
  }

  // Proxy the CheapShark API
  app.get("/api/cheapshark-deals", async (req, res) => {
    try {
      const searchTitle = req.query.title ? (req.query.title as string) : "";
      let data;

      if (searchTitle) {
        const url = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(searchTitle)}&limit=5`;
        const gamesList = await fetchCheapshark(url);
        data = [];

        // Fetch RAWG data in parallel
        const rawgPromise = fetchRawgSearch(searchTitle);

        if (Array.isArray(gamesList)) {
           // Fetch full game objects in parallel
           const gamePromises = gamesList.map(g => fetchCheapshark(`https://www.cheapshark.com/api/1.0/games?id=${g.gameID}`));
           const detailedGames = await Promise.all(gamePromises);
           
           detailedGames.forEach((detail, idx) => {
              if (detail && detail.deals && Array.isArray(detail.deals)) {
                 const baseInfo = detail.info || gamesList[idx];
                 detail.deals.forEach((deal: any) => {
                    data.push({
                       dealID: deal.dealID,
                       title: baseInfo.title || gamesList[idx].external,
                       normalPrice: deal.retailPrice || "0.00",
                       salePrice: deal.price,
                       thumb: baseInfo.thumb || gamesList[idx].thumb,
                       steamAppID: baseInfo.steamAppID || gamesList[idx].steamAppID,
                       steamRatingText: "N/A",
                       steamRatingPercent: "0",
                       steamRatingCount: "0",
                       storeID: deal.storeID,
                       type: "Price Comparison"
                    });
                 });
              }
           });
        }
        
        try {
            const rawgData = await rawgPromise;
            if (rawgData && Array.isArray(rawgData.results)) {
                // Merge rawg data
                const existingTitles = new Set(data.map((d: any) => d.title.toLowerCase()));
                rawgData.results.forEach((rg: any) => {
                    if (!existingTitles.has(rg.name.toLowerCase())) {
                       existingTitles.add(rg.name.toLowerCase());
                       data.push({
                           dealID: `rawg_${rg.id}`,
                           title: rg.name,
                           normalPrice: "N/A",
                           salePrice: "N/A",
                           thumb: rg.background_image,
                           steamAppID: "",
                           steamRatingText: "RAWG",
                           steamRatingPercent: rg.metacritic || 0,
                           steamRatingCount: rg.reviews_count || 0,
                           storeID: "1",
                           type: "Game Info",
                           rawg_platforms: (rg.platforms || []).map((p: any) => p.platform.name).join(', '),
                           rawg_url: `https://rawg.io/games/${rg.slug}`
                       });
                    }
                });
            }
        } catch(e) {
            console.error("RAWG merge failed", e);
        }

      } else {
        const url = `https://www.cheapshark.com/api/1.0/deals?sortBy=DealRating&onSale=1`;
        data = await fetchCheapshark(url);
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching cheapshark deals:", error);
      res.json([]);
    }
  });

  // Token management for Twitch/IGDB
  let twitchAccessToken = "";
  let tokenExpiration = 0;
  const IGDB_REQUEST_INTERVAL_MS = Math.max(parseInt(process.env.IGDB_REQUEST_INTERVAL_MS || "300", 10) || 300, 300);

  async function getTwitchToken(): Promise<string | null> {
    if (twitchAccessToken && Date.now() < tokenExpiration) return twitchAccessToken;
    
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) return null;
    
    try {
      const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
        method: "POST"
      });
      const text = await res.text();
      let data; try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from Twitch OAuth"); }
      if (!res.ok) throw new Error(data.message || "Failed to fetch token");
      twitchAccessToken = data.access_token;
      tokenExpiration = Date.now() + (data.expires_in * 1000) - 60000;
      return twitchAccessToken;
    } catch (error) {
      console.error("Failed to fetch Twitch token:", error);
      return null;
    }
  }

  const igdbCache = new Map<string, any>();
  const igdbPending = new Map<string, Promise<any>>();

  async function fetchIgdbData(title: string) {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const token = await getTwitchToken();

    if (!clientId || !token) return { not_found: true, reason: "igdb_not_configured" };

    let cleanTitle = String(title)
      .replace(/\(.*?\)/g, '')
      .replace(/\bGiveaway\b/gi, '')
      .replace(/\bFree Weekend\b/gi, '')
      .replace(/\bPlaytest\b/gi, '')
      .replace(/^The\s+/i, '')
      .trim();

    cleanTitle = cleanTitle.replace(/"/g, '').replace(/:/g, '');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
          "Client-ID": clientId,
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: `search "${cleanTitle}"; fields name,rating,summary,cover.url,genres.name,platforms.name,url; limit 10;`,
        signal: controller.signal as any
      });
      clearTimeout(timeout);
      
      if (!response.ok) throw new Error("Failed to fetch from IGDB");
      const text = await response.text();
      let data; try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from IGDB"); }
      
      if (data && data.length > 0) {
        const selectedGame = data.find((game: any) => game.name?.toLowerCase() === cleanTitle.toLowerCase()) || data[0];
        if (selectedGame.cover && selectedGame.cover.url) {
          selectedGame.background_image = 'https:' + selectedGame.cover.url.replace('t_thumb', 't_1080p');
        }
        return selectedGame;
      } else {
        return { not_found: true };
      }
    } catch(err) {
      clearTimeout(timeout);
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

      if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
        const result = { not_found: true, reason: "igdb_not_configured" };
        igdbCache.set(titleStr, result);
        return res.json(result);
      }

      if (igdbPending.has(titleStr)) {
        return res.json(await igdbPending.get(titleStr));
      }

      const dataPromise = fetchIgdbData(String(title));
      igdbPending.set(titleStr, dataPromise);

      try {
        const data = await dataPromise;
        igdbCache.set(titleStr, data);
        res.json(data);
      } finally {
        igdbPending.delete(titleStr);
      }
    } catch (error: any) {
      console.error("Error fetching IGDB info:", error);
      res.json({ not_found: true });
    }
  });

  // Query RAWG API for enhanced game info
  const rawgCache = new Map<string, any>();
  const rawgPending = new Map<string, Promise<any>>();
  const RAWG_MONTHLY_LIMIT = Math.max(parseInt(process.env.RAWG_MONTHLY_LIMIT || "20000", 10) || 20000, 1);

  const RAWG_USAGE_FILE = path.join(os.tmpdir(), "rawg-usage.json");

  function getRawgMonthKey() {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  function readRawgUsage() {
    const fallback = { month: getRawgMonthKey(), count: 0 };
    try {
      if (!fs.existsSync(RAWG_USAGE_FILE)) return fallback;
      const data = JSON.parse(fs.readFileSync(RAWG_USAGE_FILE, "utf8"));
      if (typeof data.month === "string" && Number.isFinite(data.count)) {
        return { month: data.month, count: Math.max(0, Number(data.count)) };
      }
    } catch (error) {
      console.warn("Could not read RAWG usage counter:", error);
    }
    return fallback;
  }

  let rawgUsage = readRawgUsage();

  function saveRawgUsage() {
    try {
      fs.mkdirSync(path.dirname(RAWG_USAGE_FILE), { recursive: true });
      fs.writeFileSync(RAWG_USAGE_FILE, JSON.stringify(rawgUsage, null, 2));
    } catch (error) {
      console.warn("Could not save RAWG usage counter:", error);
    }
  }

  function getCurrentRawgUsage() {
    const currentMonth = getRawgMonthKey();
    if (rawgUsage.month !== currentMonth) {
      rawgUsage = { month: currentMonth, count: 0 };
      saveRawgUsage();
    }
    return rawgUsage;
  }

  function rawgLimitReachedResult() {
    const usage = getCurrentRawgUsage();
    return {
      not_found: true,
      reason: "rawg_monthly_limit_reached",
      monthlyLimit: RAWG_MONTHLY_LIMIT,
      monthlyUsage: usage.count,
    };
  }

  function incrementRawgUsage() {
    const usage = getCurrentRawgUsage();
    rawgUsage = { month: usage.month, count: usage.count + 1 };
    saveRawgUsage();
  }

  async function fetchRawgData(title: string) {
    const rawgKey = process.env.RAWG_API_KEY;
    if (!rawgKey) return { not_found: true, reason: "rawg_not_configured" };

    const usage = getCurrentRawgUsage();
    if (usage.count >= RAWG_MONTHLY_LIMIT) return rawgLimitReachedResult();

    let cleanTitle = String(title)
      .replace(/\(.*?\)/g, '')
      .replace(/\bGiveaway\b/gi, '')
      .replace(/\bPlaytest\b/gi, '')
      .trim();

    const encodedTitle = encodeURIComponent(cleanTitle);
    const response = await fetch(`https://api.rawg.io/api/games?search=${encodedTitle}&key=${rawgKey}&page_size=1`, {
      headers: {
        "User-Agent": "FreeGameTracker/1.0"
      }
    });
    incrementRawgUsage();
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Failed to fetch from RAWG: Invalid API Key");
      }
      throw new Error(`Failed to fetch from RAWG: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { throw new Error("Invalid JSON from RAWG"); }
    
    return data.results && data.results.length > 0 ? data.results[0] : { not_found: true };
  }

  async function fetchRawgSearch(query: string) {
    const rawgKey = process.env.RAWG_API_KEY;
    if (!rawgKey) return { results: [] };

    const usage = getCurrentRawgUsage();
    if (usage.count >= RAWG_MONTHLY_LIMIT) return rawgLimitReachedResult();

    const encodedTitle = encodeURIComponent(query);
    const response = await fetch(`https://api.rawg.io/api/games?search=${encodedTitle}&key=${rawgKey}&page_size=10`, {
      headers: {
        "User-Agent": "FreeGameTracker/1.0"
      }
    });
    incrementRawgUsage();
    if (!response.ok) return { results: [] };
    const data = await response.json();
    return data;
  }

  app.get("/api/rawg-search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) return res.json([]);
      const data = await fetchRawgSearch(String(query));
      res.json(data.results || []);
    } catch (e) {
      res.json([]);
    }
  });

  app.get("/api/rawg", async (req, res) => {
    try {
      const { title } = req.query;
      if (!title) return res.status(400).json({ error: "Missing title query parameter" });

      const titleStr = String(title).toLowerCase();
      if (rawgCache.has(titleStr)) {
        return res.json(rawgCache.get(titleStr));
      }

      if (!process.env.RAWG_API_KEY) {
        const result = { not_found: true, reason: "rawg_not_configured" };
        rawgCache.set(titleStr, result);
        return res.json(result);
      }

      if (getCurrentRawgUsage().count >= RAWG_MONTHLY_LIMIT) {
        return res.json(rawgLimitReachedResult());
      }

      if (rawgPending.has(titleStr)) {
        return res.json(await rawgPending.get(titleStr));
      }

      const dataPromise = fetchRawgData(String(title));
      rawgPending.set(titleStr, dataPromise);

      try {
        const data = await dataPromise;
        rawgCache.set(titleStr, data);
        res.json(data);
      } finally {
        rawgPending.delete(titleStr);
      }
    } catch (error) {
      console.error("Error fetching RAWG data:", error);
      res.json({ not_found: true });
    }
  });


  app.post("/api/unsubscribe", async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!subscribedEmails.has(email)) {
      return res.status(400).json({ error: "Email is not subscribed" });
    }

    subscribedEmails.delete(email);
    console.log(`Email unsubscribed: ${email}`);
    res.json({ message: "Unsubscribed successfully. You will no longer receive emails." });
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
      }).catch(err => {
        console.log("Welcome email not sent (SMTP might be misconfigured/invalid credentials).");
      });
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
        }).catch(err => {
          console.log("Share email not sent (SMTP might be misconfigured/invalid credentials).");
        });
      } else {
        // Just simulate success if no real SMTP is available
        console.log("No SMTP Config: Simulated sending email log.");
      }
      res.json({ message: "Deal shared successfully!" });
    } catch (error) {
      console.log("Error sending share email (SMTP might be misconfigured).");
      res.json({ message: "Deal shared successfully! (Simulated)" });
    }
  });

  // Web Crawler for Gaming News using cheerio
  const NEWS_REFRESH_INTERVAL_MS = Math.max(parseInt(process.env.NEWS_REFRESH_INTERVAL_MS || "1800000", 10) || 1800000, 300000);
  const newsCache = {
    data: null as any[] | null,
    timestamp: 0,
    error: null as string | null
  };
  let newsRefreshPromise: Promise<any[]> | null = null;

  async function crawlGamingNews() {
    const news: any[] = [];
    let currentId = 0;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    
    const [pcGamerRes, rpsRes] = await Promise.allSettled([
      fetch("https://www.pcgamer.com/news/", { signal: controller.signal as any }),
      fetch("https://www.rockpapershotgun.com/latest", { signal: controller.signal as any })
    ]);
    clearTimeout(timeout);

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

    return news.sort(() => Math.random() - 0.5).slice(0, 5);
  }

  async function refreshNewsCache() {
    if (newsRefreshPromise) return newsRefreshPromise;

    newsRefreshPromise = crawlGamingNews()
      .then(finalNews => {
        if (finalNews.length > 0) {
          newsCache.data = finalNews;
          newsCache.timestamp = Date.now();
          newsCache.error = null;
        }
        return finalNews;
      })
      .catch((error: any) => {
        newsCache.error = error?.message || "Failed to crawl news";
        console.error("Error crawling news:", error);
        if (newsCache.data) return newsCache.data;
        throw error;
      })
      .finally(() => {
        newsRefreshPromise = null;
      });

    return newsRefreshPromise;
  }

  if (!process.env.VERCEL) {
    const newsRefreshTimer = setInterval(() => {
      refreshNewsCache().catch(() => {
        // Error is logged in refreshNewsCache; keep the scheduler alive.
      });
    }, NEWS_REFRESH_INTERVAL_MS);
    newsRefreshTimer.unref?.();
  }

  app.get("/api/news", async (req, res) => {
    try {
      const forceRefresh = req.query.refresh === "1";
      const hasFreshCache = newsCache.data && Date.now() - newsCache.timestamp < NEWS_REFRESH_INTERVAL_MS;

      if (!forceRefresh && hasFreshCache) {
        return res.json(newsCache.data);
      }

      const finalNews = await refreshNewsCache();
      newsCache.data = finalNews;
      newsCache.timestamp = Date.now();

      res.json(finalNews);
    } catch (error: any) {
      if (newsCache.data) return res.json(newsCache.data);
      res.json([]);
    }
  });

  let activeSockets = 0;
  // Fallback for Vercel Serverless (using HTTP endpoint instead of Websockets)
  const activeSessions = new Map<string, { lastSeen: number, platform: string, country: string }>();
  const totalVisitors = new Set<string>();

  // Helper to get platform from Vercel header or user-agent
  const getPlatform = (req: express.Request) => {
    const vercelOs = req.headers['x-vercel-os'] as string;
    if (vercelOs) {
      if (vercelOs.toLowerCase().includes('win')) return 'windows';
      if (vercelOs.toLowerCase().includes('mac')) return 'mac';
      if (vercelOs.toLowerCase().includes('linux')) return 'linux';
      if (vercelOs.toLowerCase().includes('ios') || vercelOs.toLowerCase().includes('android')) return 'mobile';
    }
    
    // Fallback parsing
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    if (/mobi|android|iphone|ipad/.test(userAgent)) return 'mobile';
    if (/windows/.test(userAgent)) return 'windows';
    if (/mac os/.test(userAgent)) return 'mac';
    if (/linux/.test(userAgent)) return 'linux';
    return 'other';
  };

  app.post("/api/ping", express.json(), (req, res) => {
    const { visitorId } = req.body || {};
    
    // Generate a simple session ID based on IP or fall back to connection remoteAddress
    const sessionId = visitorId || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const platform = getPlatform(req);
    const country = (req.headers['x-vercel-ip-country'] as string) || 'Unknown';
    
    totalVisitors.add(sessionId);

    activeSessions.set(sessionId, {
      lastSeen: Date.now(),
      platform,
      country
    });

    // Clean up stale sessions (older than 15 seconds)
    const now = Date.now();
    for (const [key, value] of activeSessions.entries()) {
      if (now - value.lastSeen > 15 * 1000) {
        activeSessions.delete(key);
      }
    }

    res.json({ success: true, activeUsers: activeSessions.size, totalVisits: totalVisitors.size });
  });

  app.post("/api/admin/login", express.json(), (req, res) => {
    const { email, password } = req.body || {};
    const validEmail = process.env.ADMIN_EMAIL || "amitnaik0023@gmail.com";
    const validPassword = process.env.ADMIN_PASSWORD || "Amit_Naik12";
    
    if (email === validEmail && password === validPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    // Attempt to fetch from Vercel REST API if token exists
    const hasVercelApi = !!process.env.VERCEL_TOKEN;

    // Local computed stats from activeSessions
    const platformStats = { windows: 0, mac: 0, linux: 0, mobile: 0, other: 0 };
    const countryStats: Record<string, number> = {};

    for (const session of activeSessions.values()) {
        const plat = session.platform;
        if (platformStats[plat as keyof typeof platformStats] !== undefined) {
           platformStats[plat as keyof typeof platformStats]++;
        } else {
           platformStats.other++;
        }
        
        const country = session.country || 'Unknown';
        countryStats[country] = (countryStats[country] || 0) + 1;
    }

    res.json({
      activeUsers: activeSessions.size,
      totalVisits: totalVisitors.size,
      platformStats,
      countryStats,
      hasVercelApi,
      source: "Vercel Headers & Active Pings"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const startVite = async () => {
      try {
        const vitePath = "vite";
        const { createServer: createViteServer } = await import(/* @vite-ignore */ vitePath);
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
      } catch (err) {
        console.error("Failed to map Vite middleware", err);
      }
    };
    startVite();
  } else if (!process.env.VERCEL) {
    // In production, serve the built static UI
    const distPath = path.join(process.cwd(), "dist");
    
    // Read the built index.html for rewriting
    const fs = require("fs");
    let baseHtml = "";
    try {
      baseHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
    } catch (e) {
      console.warn("Could not read dist/index.html");
    }

    // Serve static files but skip for / so we can rewrite meta tags
    app.use(express.static(distPath, { index: false }));
    
    // SPA fallback with basic SSR for meta tags
    app.get("*", (req, res) => {
      let html = baseHtml;
      if (!html) {
        return res.sendFile(path.join(distPath, "index.html"));
      }

      const pathName = req.path;
      let title = "GamesDealsHub | Track Free PC Games & Gaming Deals";
      let desc = "Track and claim free PC games before they expire. Find Steam free weekends, Epic Games giveaways, GOG freebies, and limited-time premium AAA game promotions.";

      if (pathName === "/about") {
        title = "About Us | GamesDealsHub";
        desc = "Learn more about GamesDealsHub, your trusted source for tracking free PC games and analyzing premium deals across Steam, Epic, GOG, and more.";
      } else if (pathName === "/privacy") {
        title = "Privacy Policy | GamesDealsHub";
        desc = "Privacy Policy for GamesDealsHub outlining data collection, Google AdSense personalization, and how your privacy is protected.";
      } else if (pathName === "/terms") {
        title = "Terms of Service | GamesDealsHub";
        desc = "Terms of Service and conditions for using GamesDealsHub's deals and alerts platform.";
      } else if (pathName === "/contact") {
        title = "Contact Us | GamesDealsHub";
        desc = "Contact the GamesDealsHub team for advertising, partnerships, or general inquiries.";
      }

      const canonical = `https://www.gamesdealshub.me${pathName === '/' ? '' : pathName}`;

      // Rewrite tags in HTML
      html = html.replace(
        /<title>([^<]*)<\/title>/gi,
        `<title>${title}</title>`
      );
      
      html = html.replace(
        /<meta (name|property)="(title|og:title|twitter:title)" content="([^"]*)" \/>/gi,
        `<meta $1="$2" content="${title}" />`
      );

      html = html.replace(
        /<meta (name|property)="(description|og:description|twitter:description)" content="([^"]*)" \/>/gi,
        `<meta $1="$2" content="${desc}" />`
      );

      html = html.replace(
        /<link rel="canonical" href="([^"]*)" \/>/gi,
        `<link rel="canonical" href="${canonical}" />`
      );

      res.send(html);
    });
  }

  if (!process.env.VERCEL) {
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      refreshNewsCache().catch(() => {});
    });
  }
  
  export default app;
