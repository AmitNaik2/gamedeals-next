const CACHE = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000;

export function isActiveGiveaway(item: {
  title?: string;
  end_date?: string;
  status?: string;
}): boolean {
  if (item.status && item.status.toLowerCase() !== "active") return false;
  if (item.title && item.title.includes("Terrors to Unveil")) return false;
  if (!item.end_date || item.end_date === "N/A") return true;

  const endStr =
    item.end_date.includes(" ") &&
    !item.end_date.includes("Z") &&
    !item.end_date.includes("GMT")
      ? item.end_date.replace(" ", "T") + "Z"
      : item.end_date;

  const endDate = new Date(endStr);
  if (Number.isNaN(endDate.getTime())) return true;
  return endDate.getTime() > Date.now();
}

export async function fetchGamerPower(url: string): Promise<unknown> {
  const cached = CACHE.get(url);
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (response.ok) {
      const data = await response.json();
      CACHE.set(url, { data, timestamp: Date.now() });
      return data;
    }
  } catch {
    /* primary failed */
  }

  try {
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const proxyRes = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      CACHE.set(url, { data, timestamp: Date.now() });
      return data;
    }
  } catch {
    /* proxy failed */
  }

  if (cached) return cached.data;
  throw new Error("GamerPower fetch failed");
}
