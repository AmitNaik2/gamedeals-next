import { sendJson } from "./_utils";

export default async function handler(req: any, res: any) {
  try {
    const title = typeof req.query?.title === "string" ? req.query.title : "";
    if (!title) return sendJson(res, 400, { error: "Missing title query parameter" });
    if (!process.env.RAWG_API_KEY) return sendJson(res, 200, { not_found: true, reason: "rawg_not_configured" });

    const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${process.env.RAWG_API_KEY}&page_size=1`);
    if (!response.ok) return sendJson(res, response.status, { not_found: true, reason: "rawg_request_failed" });

    const data = await response.json();
    const game = data.results?.[0];
    if (!game) return sendJson(res, 200, { not_found: true });

    return sendJson(res, 200, {
      background_image: game.background_image,
      rating: game.rating,
      metacritic: game.metacritic,
    });
  } catch (error) {
    console.error("Error fetching RAWG data:", error);
    return sendJson(res, 500, { not_found: true, reason: "rawg_request_failed" });
  }
}
