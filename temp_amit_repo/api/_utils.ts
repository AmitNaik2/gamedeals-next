export function isActiveGiveaway(item: { end_date?: string; status?: string }) {
  if (item.status && item.status.toLowerCase() !== "active") return false;
  if (!item.end_date || item.end_date === "N/A") return true;

  const endDate = new Date(item.end_date.replace(" ", "T"));
  if (Number.isNaN(endDate.getTime())) return true;

  return endDate.getTime() > Date.now();
}

export function sendJson(res: any, status: number, data: unknown) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

export const browserHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};
