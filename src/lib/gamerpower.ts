import { GameDeal } from "../types";

const BASE_URL = "https://www.gamerpower.com/api";

const GAMERPOWER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://www.gamerpower.com/",
  "Origin": "https://www.gamerpower.com",
};

// Add titles to exclude here instead of hardcoding inline ifs
const BLOCKLIST = ["Terrors to Unveil"];

// ── Active deal filter ────────────────────────────────────────────────────────

export function isActiveDeal(deal: GameDeal): boolean {
  if (deal.status?.toLowerCase() !== "active") return false;
  if (BLOCKLIST.some((blocked) => deal.title?.includes(blocked))) return false;
  if (!deal.end_date || deal.end_date === "N/A") return true;

  // Normalize to ISO 8601 UTC so Date.parse works reliably across environments
  const endStr =
    deal.end_date.includes(" ") &&
    !deal.end_date.includes("Z") &&
    !deal.end_date.includes("GMT")
      ? deal.end_date.replace(" ", "T") + "Z"
      : deal.end_date;

  const endDate = new Date(endStr);
  if (Number.isNaN(endDate.getTime())) return true; // unparseable → assume active
  return endDate.getTime() > Date.now();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function parseEstimatedValue(worth: string): number {
  if (!worth || worth === "N/A" || worth === "Free") return 0;
  return parseFloat(worth.replace(/[^0-9.]/g, "")) || 0;
}

export function getUrgencyMs(endDate: string): number {
  if (!endDate || endDate === "N/A") return Infinity;
  return new Date(endDate).getTime() - Date.now();
}

function formatDeal(deal: any): GameDeal {
  return {
    ...deal,
    id: `gp_${deal.id}`,
    worth: deal.worth || "N/A",
    thumbnail: deal.thumbnail || deal.image || "",
    image: deal.image || deal.thumbnail || "",
    open_giveaway_url: deal.open_giveaway_url || deal.gamerpower_url || "",
    end_date: deal.end_date || "N/A",
  };
}

// ── Data fetchers (Next.js ISR via native fetch) ──────────────────────────────

export async function getActiveGames(): Promise<GameDeal[]> {
  const url = `${BASE_URL}/giveaways?type=game&sort-by=date`;
  console.log(`[gamerpower] Fetching: ${url}`);
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
      headers: GAMERPOWER_HEADERS,
    });
    
    console.log(`[gamerpower] Response status: ${res.status}`);
    if (!res.ok) {
      console.error(`[gamerpower] Failed ${res.status}: ${res.statusText} for ${url}`);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    // ✅ FIX: Filter expired/inactive deals — original returned everything raw
    return data.map(formatDeal).filter(isActiveDeal);
  } catch (error) {
    console.error("[gamerpower] getActiveGames error:", error);
    return [];
  }
}

export async function getGameDealById(id: string | number): Promise<GameDeal | null> {
  const cleanId = String(id).replace("gp_", "");
  const primaryUrl = `${BASE_URL}/giveaway?id=${cleanId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(primaryUrl)}`;

  console.log(`[gamerpower] Fetching: ${primaryUrl}`);

  // Attempt 1: Direct fetch with browser headers
  try {
    const res = await fetch(primaryUrl, {
      next: { revalidate: 3600 },
      headers: GAMERPOWER_HEADERS,
    });
    
    console.log(`[gamerpower] Response status: ${res.status}`);
    
    if (res.ok) {
      const data = await res.json();
      const isValidDeal = 
        data &&
        data.id &&
        String(data.status).toLowerCase() !== "error" &&
        Number(data.status) !== 0;
        
      if (isValidDeal) {
        console.log(`[gamerpower] Direct fetch success for id: ${cleanId}`);
        return formatDeal(data);
      }
      console.warn(`[gamerpower] Invalid data for ${cleanId}:`, JSON.stringify(data).slice(0, 200));
    }
    console.warn(`[gamerpower] Direct fetch failed for ${cleanId}, trying proxy...`);
  } catch (e: any) {
    // If Next.js throws a DYNAMIC_SERVER_USAGE error to bailout to dynamic rendering, we MUST rethrow it
    if (e.digest === 'DYNAMIC_SERVER_USAGE') throw e;
    console.warn(`[gamerpower] Direct fetch exception for ${cleanId}:`, e);
  }

  // Attempt 2: CORS proxy fallback
  try {
    const proxyRes = await fetch(proxyUrl, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": GAMERPOWER_HEADERS["User-Agent"] },
    });
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const isValidDeal = 
        data &&
        data.id &&
        String(data.status).toLowerCase() !== "error" &&
        Number(data.status) !== 0;
        
      if (isValidDeal) {
        console.log(`[gamerpower] Proxy fetch success for id: ${cleanId}`);
        return formatDeal(data);
      }
      console.warn(`[gamerpower] Invalid data for ${cleanId}:`, JSON.stringify(data).slice(0, 200));
    }
  } catch (e: any) {
    if (e.digest === 'DYNAMIC_SERVER_USAGE') throw e;
    console.error(`[gamerpower] Proxy fetch exception for ${cleanId}:`, e);
  }

  console.error(`[gamerpower] All fetches failed for id: ${cleanId}`);
  return null;
}

// ✅ NEW: Platform-specific fetcher — powers the SEO rewrite URLs
export async function getActiveGamesByPlatform(
  platform: "steam" | "epic-games-store" | "gog" | "all"
): Promise<GameDeal[]> {
  if (platform === "all") return getActiveGames();

  const url = `${BASE_URL}/giveaways?platform=${platform}&sort-by=date`;
  console.log(`[gamerpower] Fetching: ${url}`);
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: GAMERPOWER_HEADERS,
    });

    console.log(`[gamerpower] Response status: ${res.status}`);
    if (!res.ok) {
      console.error(`[gamerpower] Failed ${res.status}: ${res.statusText} for ${url}`);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(formatDeal).filter(isActiveDeal);
  } catch (error) {
    console.error(`[gamerpower] getActiveGamesByPlatform(${platform}) error:`, error);
    return [];
  }
}
