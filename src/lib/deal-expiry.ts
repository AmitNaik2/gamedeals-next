import { type GameDeal } from "../types";

const SOON_WINDOW_MS = 72 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export type DealExpiryBadge = "today" | "soon" | null;

export function normalizeDealEndDate(endDate?: string | null): string | null {
  if (!endDate || endDate === "N/A") return null;
  return endDate.includes(" ") && !endDate.includes("Z") && !endDate.includes("GMT")
    ? endDate.replace(" ", "T") + "Z"
    : endDate;
}

export function getDealExpiryTime(endDate?: string | null): number {
  const normalized = normalizeDealEndDate(endDate);
  if (!normalized) return Infinity;

  const time = new Date(normalized).getTime();
  return Number.isNaN(time) ? Infinity : time;
}

export function isDealExpired(deal: Pick<GameDeal, "end_date">, now = Date.now()): boolean {
  const expiryTime = getDealExpiryTime(deal.end_date);
  return Number.isFinite(expiryTime) && expiryTime <= now;
}

export function isActiveByExpiry(deal: Pick<GameDeal, "end_date">, now = Date.now()): boolean {
  return !isDealExpired(deal, now);
}

export function getMsUntilExpiry(deal: Pick<GameDeal, "end_date">, now = Date.now()): number {
  return getDealExpiryTime(deal.end_date) - now;
}

export function getDealExpiryBadge(deal: Pick<GameDeal, "end_date">, now = Date.now()): DealExpiryBadge {
  const expiryTime = getDealExpiryTime(deal.end_date);
  if (!Number.isFinite(expiryTime) || expiryTime <= now) return null;

  const expiry = new Date(expiryTime);
  const current = new Date(now);
  const expiresToday =
    expiry.getUTCFullYear() === current.getUTCFullYear() &&
    expiry.getUTCMonth() === current.getUTCMonth() &&
    expiry.getUTCDate() === current.getUTCDate();

  if (expiresToday) return "today";
  if (expiryTime - now <= SOON_WINDOW_MS) return "soon";
  return null;
}

export function isExpiringWithin24h(deal: Pick<GameDeal, "end_date">, now = Date.now()): boolean {
  const msUntilExpiry = getMsUntilExpiry(deal, now);
  return msUntilExpiry > 0 && msUntilExpiry <= ONE_DAY_MS;
}

export function filterActiveDeals<T extends Pick<GameDeal, "end_date">>(deals: T[], now = Date.now()): T[] {
  return deals.filter((deal) => isActiveByExpiry(deal, now));
}

export function sortDealsByExpiryAsc<T extends Pick<GameDeal, "end_date">>(deals: T[]): T[] {
  return [...deals].sort((a, b) => getDealExpiryTime(a.end_date) - getDealExpiryTime(b.end_date));
}

export function formatUtcExpiry(endDate?: string | null): string | null {
  const expiryTime = getDealExpiryTime(endDate);
  if (!Number.isFinite(expiryTime)) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(expiryTime));
}

export function formatLastApiFetch(date: Date | null, now = Date.now()): string {
  if (!date) return "Waiting for API sync";

  const diffMs = Math.max(0, now - date.getTime());
  if (diffMs < 60_000) return "Updated just now";

  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `Updated ${mins} min${mins === 1 ? "" : "s"} ago`;

  return `Last API fetch ${new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date)}`;
}
