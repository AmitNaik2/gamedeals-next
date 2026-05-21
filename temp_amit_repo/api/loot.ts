import { browserHeaders, isActiveGiveaway, sendJson } from "./_utils";

export default async function handler(req: any, res: any) {
  try {
    const response = await fetch("https://www.gamerpower.com/api/giveaways?type=loot", { headers: browserHeaders });
    if (!response.ok) {
      return sendJson(res, response.status, { error: "Failed to fetch loot" });
    }

    let data = await response.json();
    if (Array.isArray(data)) {
      const search = typeof req.query?.search === "string" ? req.query.search.toLowerCase() : "";
      data = data.filter(isActiveGiveaway);

      if (search) {
        data = data.filter((item: any) =>
          item.title?.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search) ||
          item.instructions?.toLowerCase().includes(search)
        );
      }

      data.sort((a: any, b: any) => b.id - a.id);
      data = data.slice(0, 50);
    }

    return sendJson(res, 200, data);
  } catch (error) {
    console.error("Error fetching loot:", error);
    return sendJson(res, 500, { error: "Failed to fetch loot" });
  }
}
