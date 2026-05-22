import { browserHeaders, sendJson } from "./_utils";

export default async function handler(req: any, res: any) {
  try {
    const response = await fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1,2,3,7,8,11,13&sortBy=DealRating&onSale=1", {
      headers: browserHeaders,
    });

    if (!response.ok) {
      return sendJson(res, response.status, { error: "Failed to fetch cheapshark deals" });
    }

    return sendJson(res, 200, await response.json());
  } catch (error) {
    console.error("Error fetching cheapshark deals:", error);
    return sendJson(res, 500, { error: "Failed to fetch cheapshark deals" });
  }
}
