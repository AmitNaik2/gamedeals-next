import { browserHeaders, isActiveGiveaway, sendJson } from "./_utils";

export default async function handler(req: any, res: any) {
  try {
    const type = typeof req.query?.type === "string" ? req.query.type : "";
    const url = type
      ? `https://www.gamerpower.com/api/giveaways?type=${encodeURIComponent(type)}&sort-by=date`
      : "https://www.gamerpower.com/api/giveaways?sort-by=date";

    const response = await fetch(url, { headers: browserHeaders });
    if (!response.ok) {
      return sendJson(res, response.status, { error: "Failed to fetch deals" });
    }

    let data = await response.json();
    if (Array.isArray(data)) {
      const trustedPlatforms = ['steam', 'epic', 'xbox', 'playstation', 'ps4', 'ps5', 'origin', 'battle.net', 'ubisoft', 'ea', 'gog', 'pc', 'itch.io', 'nintendo'];
      data = data.filter((deal: any) => {
        if (!deal.platforms) return false;
        const platforms = deal.platforms.toLowerCase();
        return isActiveGiveaway(deal) && trustedPlatforms.some(platform => platforms.includes(platform));
      });
    }

    return sendJson(res, 200, data);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return sendJson(res, 500, { error: "Failed to fetch deals" });
  }
}
