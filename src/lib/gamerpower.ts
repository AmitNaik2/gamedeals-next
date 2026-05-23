import { GameDeal } from "../types";

const BASE_URL = "https://www.gamerpower.com/api";

// Titles to permanently exclude (extend array as needed)
const BLOCKLIST = ["Terrors to Unveil"];

// ── Active deal filter ────────────────────────────────────────────────────────

export function isActiveDeal(deal: GameDeal): boolean {
  if (deal.status?.toLowerCase() !== "active") return false;
  if (BLOCKLIST.some((blocked) => deal.title?.includes(blocked))) return false;
  if (!deal.end_date || deal.end_date === "N/A") return true;

  const endStr =
    deal.end_date.includes(" ") &&
    !deal.end_date.includes("Z") &&
    !deal.end_date.includes("GMT")
      ? deal.end_date.replace(" ", "T") + "Z"
      : deal.end_date;

  const endDate = new Date(endStr);
  if (Number.isNaN(endDate.getTime())) return true;
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
  try {
    const res = await fetch(`${BASE_URL}/giveaways?type=game&sort-by=date`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`[gamerpower] getActiveGames failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    // ✅ FIX: Filter expired/inactive deals before returning
    return data.map(formatDeal).filter(isActiveDeal);
  } catch (error) {
    console.error("[gamerpower] getActiveGames error:", error);
    return [];
  }
}

export async function getGameDealById(id: string | number): Promise<GameDeal | null> {
  try {
    const cleanId = String(id).replace("gp_", "");
    const res = await fetch(`${BASE_URL}/giveaway?id=${cleanId}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.status === "Error") return null;

    return formatDeal(data);
  } catch (error) {
    console.error(`[gamerpower] getGameDealById(${id}) error:`, error);
    return null;
  }
}

export async function getActiveGamesByPlatform(
  platform: "steam" | "epic-games-store" | "gog" | "all"
): Promise<GameDeal[]> {
  if (platform === "all") return getActiveGames();

  try {
    const res = await fetch(`${BASE_URL}/giveaways?platform=${platform}&sort-by=date`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(formatDeal).filter(isActiveDeal);
  } catch (error) {
    console.error(`[gamerpower] getActiveGamesByPlatform(${platform}) error:`, error);
    return [];
  }
}
