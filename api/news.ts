import { sendJson } from "./_utils";

let newsCache: { data: any[] | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};

const NEWS_REFRESH_INTERVAL_MS = Math.max(parseInt(process.env.NEWS_REFRESH_INTERVAL_MS || "1800000", 10) || 1800000, 300000);

async function crawlGamingNews() {
  const cheerio = await import("cheerio");
  const news: any[] = [];
  let currentId = 0;

  const [pcGamerRes, rpsRes] = await Promise.allSettled([
    fetch("https://www.pcgamer.com/news/"),
    fetch("https://www.rockpapershotgun.com/latest"),
  ]);

  if (pcGamerRes.status === "fulfilled" && pcGamerRes.value.ok) {
    const $ = cheerio.load(await pcGamerRes.value.text());

    $(".listingResult").slice(0, 3).each((i, el) => {
      const title = $(el).find(".article-name").text().trim();
      const link = $(el).find("a").attr("href");
      const time = $(el).find("time").text().replace("\n", "").trim() || "Recent";

      if (title && link) {
        news.push({ id: String(currentId++), title, link, time, type: "PC Gamer" });
      }
    });
  }

  if (rpsRes.status === "fulfilled" && rpsRes.value.ok) {
    const $ = cheerio.load(await rpsRes.value.text());

    $(".title").slice(0, 3).each((i, el) => {
      const title = $(el).text().trim();
      const href = $(el).find("a").attr("href");
      const link = href?.startsWith("http") ? href : `https://www.rockpapershotgun.com${href}`;

      if (title && link) {
        news.push({ id: String(currentId++), title, link, time: "Recent", type: "Rock Paper Shotgun" });
      }
    });
  }

  return news.sort(() => Math.random() - 0.5).slice(0, 5);
}

export default async function handler(req: any, res: any) {
  try {
    const forceRefresh = req.query?.refresh === "1";
    const isFresh = newsCache.data && Date.now() - newsCache.timestamp < NEWS_REFRESH_INTERVAL_MS;

    if (!forceRefresh && isFresh) {
      return sendJson(res, 200, newsCache.data);
    }

    const data = await crawlGamingNews();
    if (data.length > 0) {
      newsCache = { data, timestamp: Date.now() };
    }

    return sendJson(res, 200, newsCache.data || data);
  } catch (error) {
    console.error("Error crawling news:", error);
    if (newsCache.data) return sendJson(res, 200, newsCache.data);
    return sendJson(res, 500, { error: "Failed to crawl news" });
  }
}
