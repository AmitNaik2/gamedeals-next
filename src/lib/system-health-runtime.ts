import { revalidatePath } from "next/cache";
import { Redis } from "@upstash/redis";
import { gamingArticles, siteUrl as defaultSiteUrl } from "./articles";
import { filterActiveDeals, sortDealsByExpiryAsc } from "./deal-expiry";
import {
  getSystemHealthIssues,
  scanSystemHealth,
  setSystemHealthSummaryOverrides,
  storeSystemHealthIssues,
  summarizeSystemHealth,
  type ApiHealthCheck,
  type MutableGameDeal,
  type NamedHealthCheck,
} from "./system-health";

const GAMERPOWER_URL = "https://www.gamerpower.com/api/giveaways?sort-by=date";
const CLAIM_LINK_CHECK_LIMIT = 8;
const REQUEST_TIMEOUT_MS = 5000;

let lastScannedDeals: MutableGameDeal[] = [];

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;
}

function timeoutSignal(ms = REQUEST_TIMEOUT_MS) {
  return AbortSignal.timeout(ms);
}

function requiredEnvNames() {
  const missing = [
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "REVALIDATE_SECRET",
  ].filter((name) => !process.env[name]);

  if (process.env.VERCEL_ENV === "production" && !process.env.CRON_SECRET) {
    missing.push("CRON_SECRET");
  }

  if (process.env.UPSTASH_REDIS_REST_URL && !process.env.UPSTASH_REDIS_REST_TOKEN) {
    missing.push("UPSTASH_REDIS_REST_TOKEN");
  }

  if (process.env.UPSTASH_REDIS_REST_TOKEN && !process.env.UPSTASH_REDIS_REST_URL) {
    missing.push("UPSTASH_REDIS_REST_URL");
  }

  return missing;
}

function toMutableDeals(data: unknown): MutableGameDeal[] {
  if (!Array.isArray(data)) return [];
  return data.map((deal) => deal as MutableGameDeal);
}

async function fetchRawDeals() {
  const started = Date.now();
  const apiCheck: ApiHealthCheck = {
    name: "GamerPower Giveaways API",
    affected: GAMERPOWER_URL,
    ok: false,
    message: "GamerPower API has not been checked yet.",
  };

  try {
    const response = await fetch(GAMERPOWER_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "GamesDealsHub-SystemHealth/1.0",
      },
      signal: timeoutSignal(),
    });
    const responseTimeMs = Date.now() - started;

    apiCheck.status = response.status;
    apiCheck.responseTimeMs = responseTimeMs;
    apiCheck.ok = response.ok;
    apiCheck.message = response.ok
      ? `GamerPower API responded with ${response.status} in ${responseTimeMs}ms.`
      : `GamerPower API failed with HTTP ${response.status}.`;

    if (!response.ok) return { deals: [], apiCheck };

    const data = await response.json();
    const activeDeals = sortDealsByExpiryAsc(filterActiveDeals(toMutableDeals(data)));
    return { deals: activeDeals, apiCheck };
  } catch (error) {
    apiCheck.responseTimeMs = Date.now() - started;
    apiCheck.message = error instanceof Error ? error.message : "GamerPower API request failed.";
    return { deals: [], apiCheck };
  }
}

async function checkUrl(name: string, url: string): Promise<NamedHealthCheck> {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: timeoutSignal(),
    });
    const responseTimeMs = Date.now() - started;

    return {
      name,
      affected: url,
      ok: response.ok,
      severity: response.status >= 500 ? "Critical" : "Error",
      responseTimeMs,
      message: response.ok
        ? `${name} loaded with HTTP ${response.status} in ${responseTimeMs}ms.`
        : `${name} returned HTTP ${response.status}.`,
    };
  } catch (error) {
    return {
      name,
      affected: url,
      ok: false,
      severity: "Error",
      responseTimeMs: Date.now() - started,
      message: error instanceof Error ? error.message : `${name} request failed.`,
    };
  }
}

async function checkDatabase(): Promise<NamedHealthCheck> {
  if (!process.env.UPSTASH_REDIS_REST_URL && !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return {
      name: "Upstash Redis",
      affected: "database:optional-disconnected",
      ok: true,
      severity: "Info",
      message: "Upstash Redis is not connected; database-backed monitoring persistence is disabled.",
    };
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return {
      name: "Upstash Redis",
      affected: "database",
      ok: false,
      severity: "Error",
      message: "Upstash Redis is not connected.",
    };
  }

  const started = Date.now();
  try {
    const redis = Redis.fromEnv();
    await redis.ping();
    return {
      name: "Upstash Redis",
      affected: "database",
      ok: true,
      responseTimeMs: Date.now() - started,
      message: "Upstash Redis ping succeeded.",
    };
  } catch (error) {
    return {
      name: "Upstash Redis",
      affected: "database",
      ok: false,
      severity: "Critical",
      responseTimeMs: Date.now() - started,
      message: error instanceof Error ? error.message : "Upstash Redis ping failed.",
    };
  }
}

function checkCacheConfig(): NamedHealthCheck {
  if (!process.env.REVALIDATE_SECRET) {
    return {
      name: "Next.js revalidation",
      affected: "cache",
      ok: false,
      severity: "Critical",
      message: "REVALIDATE_SECRET is missing, so manual cache revalidation is not protected/configured.",
    };
  }

  return {
    name: "Next.js revalidation",
    affected: "cache",
    ok: true,
    message: "Revalidation secret is configured.",
  };
}

function getClaimUrl(deal: MutableGameDeal) {
  return deal.open_giveaway_url || deal.open_giveaway || deal.gamerpower_url || "";
}

async function checkClaimLinks(deals: MutableGameDeal[]): Promise<ApiHealthCheck[]> {
  const candidates = deals
    .filter((deal) => {
      try {
        const parsed = new URL(getClaimUrl(deal));
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    })
    .slice(0, CLAIM_LINK_CHECK_LIMIT);

  return Promise.all(
    candidates.map(async (deal) => {
      const url = getClaimUrl(deal);
      const started = Date.now();
      try {
        const response = await fetch(url, {
          method: "HEAD",
          cache: "no-store",
          redirect: "manual",
          signal: timeoutSignal(3500),
        });
        const responseTimeMs = Date.now() - started;
        const storefrontMayBlockHead = response.status === 403 || response.status === 405;
        const ok = response.status < 400 || storefrontMayBlockHead;

        return {
          name: `Claim URL for ${deal.title}`,
          affected: `deal:${deal.id}`,
          status: response.status,
          responseTimeMs,
          ok,
          message: ok
            ? `Claim URL responded with HTTP ${response.status} in ${responseTimeMs}ms.`
            : `Claim URL for "${deal.title}" returned HTTP ${response.status}.`,
        };
      } catch (error) {
        return {
          name: `Claim URL for ${deal.title}`,
          affected: `deal:${deal.id}`,
          responseTimeMs: Date.now() - started,
          ok: false,
          message: error instanceof Error ? error.message : `Claim URL for "${deal.title}" failed.`,
        };
      }
    })
  );
}

export async function runSystemHealthScan() {
  const [{ deals, apiCheck }, sitemapCheck, databaseCheck] = await Promise.all([
    fetchRawDeals(),
    checkUrl("Sitemap", `${getSiteUrl().replace(/\/$/, "")}/sitemap.xml`),
    checkDatabase(),
  ]);
  const cacheCheck = checkCacheConfig();
  const brokenClaimLinks = await checkClaimLinks(deals);

  lastScannedDeals = deals;
  setSystemHealthSummaryOverrides({
    databaseHealth: databaseCheck.affected === "database:optional-disconnected" ? "Not connected" : undefined,
  });

  const issues = scanSystemHealth({
    deals,
    articles: gamingArticles,
    apiChecks: [apiCheck],
    brokenClaimLinks,
    sitemapCheck,
    databaseCheck,
    cacheCheck,
    missingEnv: requiredEnvNames(),
  });

  return {
    issues: storeSystemHealthIssues(issues),
    summary: summarizeSystemHealth(),
  };
}

export function getSystemHealthState() {
  return {
    issues: getSystemHealthIssues(),
    summary: summarizeSystemHealth(),
  };
}

export async function getMutableDealsForFixes() {
  if (lastScannedDeals.length > 0) return lastScannedDeals;
  const { deals } = await fetchRawDeals();
  lastScannedDeals = deals;
  return lastScannedDeals;
}

export async function retryPrimaryDealSync() {
  const { apiCheck, deals } = await fetchRawDeals();
  if (apiCheck.ok) lastScannedDeals = deals;
  return apiCheck.ok;
}

export function revalidateHealthRoutes(routes: string[]) {
  for (const route of routes) {
    revalidatePath(route);
  }
  return true;
}
