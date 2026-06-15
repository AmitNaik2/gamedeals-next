import { addAuditLog } from "./admin-audit";
import { getDealExpiryTime, isDealExpired } from "./deal-expiry";
import { type GameDeal } from "../types";

export type IssueSeverity = "Info" | "Warning" | "Error" | "Critical";
export type IssueStatus = "Open" | "Ignored" | "Resolved" | "AutoFixed" | "FixFailed" | "RolledBack";

export type SystemHealthIssueType =
  | "failed_api_request"
  | "broken_game_detail_page"
  | "expired_deal_active"
  | "broken_claim_url"
  | "missing_images"
  | "invalid_dates"
  | "duplicate_external_ids"
  | "duplicate_slugs"
  | "duplicate_platform_values"
  | "repeated_title_words"
  | "missing_seo_metadata"
  | "sitemap_failure"
  | "cache_revalidation_failure"
  | "database_error"
  | "missing_required_env"
  | "slow_api_response"
  | "missing_description"
  | "end_before_start"
  | "missing_safe_slug";

export type SystemHealthIssue = {
  id: string;
  type: SystemHealthIssueType;
  affected: string;
  route?: string;
  itemId?: string | number;
  severity: IssueSeverity;
  message: string;
  detectedAt: string;
  status: IssueStatus;
  recommendedFix: string;
  autoFixAllowed: boolean;
  approvalRequired: boolean;
  metadata?: Record<string, string | number | boolean | null>;
};

export type ApiHealthCheck = {
  name: string;
  ok: boolean;
  message: string;
  affected?: string;
  status?: number;
  responseTimeMs?: number;
};

export type NamedHealthCheck = {
  name: string;
  ok: boolean;
  message: string;
  severity?: IssueSeverity;
  affected?: string;
  responseTimeMs?: number;
};

export type ArticleSeoRecord = {
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
};

export type SystemHealthDealRecord = Partial<GameDeal> & {
  active?: boolean;
  disabled?: boolean;
  external_id?: string | number;
  slug?: string;
};

export type SystemHealthScanInput = {
  deals: SystemHealthDealRecord[];
  articles?: ArticleSeoRecord[];
  apiChecks?: ApiHealthCheck[];
  brokenClaimLinks?: ApiHealthCheck[];
  sitemapCheck?: NamedHealthCheck;
  cacheCheck?: NamedHealthCheck;
  databaseCheck?: NamedHealthCheck;
  missingEnv?: string[];
  now?: Date;
};

export type MutableGameDeal = GameDeal & {
  active?: boolean;
  disabled?: boolean;
  hiddenReason?: string;
  slug?: string;
  claimUrlDisabled?: boolean;
  external_id?: string;
};

export type SystemHealthSummary = {
  totalOpen: number;
  criticalIssues: number;
  autoFixedToday: number;
  failedFixes: number;
  lastSystemScan: string | null;
  apiHealth: "Healthy" | "Warning" | "Error" | "Not checked";
  databaseHealth: "Healthy" | "Warning" | "Error" | "Not connected" | "Not checked";
  cacheHealth: "Healthy" | "Warning" | "Error" | "Not checked";
};

export type SafeFixResult = {
  issueId: string;
  success: boolean;
  message: string;
  rolledBack: boolean;
};

export type SafeFixOptions = {
  actorEmail?: string;
  actorRole?: string;
  retryApiSync?: () => Promise<boolean> | boolean;
  revalidateRoutes?: (routes: string[]) => Promise<boolean> | boolean;
  validateOverride?: (issue: SystemHealthIssue) => Promise<boolean> | boolean;
};

type FixSnapshot = {
  issueId: string;
  dealId?: string | number;
  previousValue: unknown;
  createdAt: string;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SLOW_API_THRESHOLD_MS = 2500;
const FALLBACK_IMAGE = "/window.svg";

const safeAutoFixTypes = new Set<SystemHealthIssueType>([
  "expired_deal_active",
  "duplicate_platform_values",
  "repeated_title_words",
  "missing_images",
  "failed_api_request",
  "cache_revalidation_failure",
  "sitemap_failure",
  "missing_safe_slug",
  "broken_claim_url",
]);

const storedIssues: SystemHealthIssue[] = [];
const fixSnapshots: FixSnapshot[] = [];
const fixResults: Array<{ success: boolean; createdAt: string }> = [];
let summaryOverrides: Partial<Pick<SystemHealthSummary, "apiHealth" | "databaseHealth" | "cacheHealth">> = {};
let lastScanAt: string | null = null;

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function createIssueId(type: SystemHealthIssueType, affected: string) {
  return `${type}_${stableHash(`${type}:${affected}`)}`;
}

function isStatusActive(status?: unknown) {
  return String(status || "Active").trim().toLowerCase() === "active";
}

function isKnownEmpty(value?: unknown) {
  const text = String(value ?? "").trim();
  return !text || text.toLowerCase() === "n/a";
}

function parseFiniteDate(value?: unknown) {
  if (isKnownEmpty(value)) return null;
  const text = String(value);
  const normalized = text.includes(" ") && !text.includes("Z") && !text.includes("GMT")
    ? `${text.replace(" ", "T")}Z`
    : text;
  const time = new Date(normalized).getTime();
  return Number.isFinite(time) ? time : Number.NaN;
}

function hasInvalidDate(value?: unknown) {
  return !isKnownEmpty(value) && Number.isNaN(parseFiniteDate(value));
}

function isHttpUrl(value?: unknown) {
  if (isKnownEmpty(value)) return false;
  try {
    const parsed = new URL(String(value));
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function splitPlatformValues(platforms?: string) {
  return String(platforms || "")
    .split(",")
    .map((platform) => platform.trim())
    .filter(Boolean);
}

export function uniquePlatformValues(platforms?: string) {
  const seen = new Set<string>();
  return splitPlatformValues(platforms).filter((platform) => {
    const key = platform.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function hasDuplicatePlatformValues(platforms?: string) {
  return splitPlatformValues(platforms).length !== uniquePlatformValues(platforms).length;
}

export function hasRepeatedTitleWords(title?: string) {
  const words = String(title || "").trim().split(/\s+/);
  return words.some((word, index) => index > 0 && word.toLowerCase() === words[index - 1].toLowerCase());
}

export function cleanRepeatedTitleWords(title?: string) {
  return String(title || "")
    .trim()
    .split(/\s+/)
    .filter((word, index, words) => index === 0 || word.toLowerCase() !== words[index - 1].toLowerCase())
    .join(" ");
}

export function safeSlug(value?: string) {
  return String(value || "game-deal")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "game-deal";
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createIssue(params: Omit<SystemHealthIssue, "id" | "detectedAt" | "status" | "autoFixAllowed" | "approvalRequired"> & { detectedAt: string }) {
  const autoFixAllowed = safeAutoFixTypes.has(params.type);
  const approvalRequired = !autoFixAllowed || params.severity === "Critical";

  return {
    id: createIssueId(params.type, params.affected),
    status: "Open" as const,
    autoFixAllowed,
    approvalRequired,
    ...params,
  };
}

export function scanSystemHealth(input: SystemHealthScanInput) {
  const now = input.now ?? new Date();
  const detectedAt = now.toISOString();
  const issues: SystemHealthIssue[] = [];
  const idCounts = new Map<string, number>();
  const slugCounts = new Map<string, number>();

  for (const deal of input.deals) {
    const itemId = deal.id ?? deal.external_id ?? deal.title ?? "unknown";
    const itemName = String(deal.title || itemId);
    const affected = `deal:${itemId}`;
    const detailRoute = deal.id ? `/game/${encodeURIComponent(String(deal.id))}` : undefined;

    if (deal.id !== undefined && deal.id !== null && String(deal.id).trim()) {
      const key = String(deal.id).toLowerCase();
      idCounts.set(key, (idCounts.get(key) || 0) + 1);
    } else {
      issues.push(createIssue({
        type: "broken_game_detail_page",
        affected,
        itemId: String(itemId),
        route: detailRoute,
        severity: "Critical",
        message: `Game detail page cannot be generated because "${itemName}" has no ID.`,
        recommendedFix: "Restore a valid external deal ID before publishing this deal.",
        detectedAt,
      }));
    }

    const slug = typeof deal.slug === "string" && deal.slug.trim()
      ? safeSlug(deal.slug)
      : safeSlug(String(deal.title || ""));
    if (slug) slugCounts.set(slug, (slugCounts.get(slug) || 0) + 1);

    if (hasInvalidDate(deal.end_date)) {
      issues.push(createIssue({
        type: "invalid_dates",
        affected,
        itemId: String(itemId),
        route: detailRoute,
        severity: "Error",
        message: `"${itemName}" has an invalid expiry date: ${String(deal.end_date)}.`,
        recommendedFix: "Edit the deal and save a valid UTC expiry date, or set the expiry to N/A if unknown.",
        detectedAt,
      }));
    }

    if (deal.start_date && !hasInvalidDate(deal.start_date) && !hasInvalidDate(deal.end_date)) {
      const startTime = parseFiniteDate(deal.start_date);
      const endTime = parseFiniteDate(deal.end_date);
      if (startTime !== null && endTime !== null && endTime < startTime) {
        issues.push(createIssue({
          type: "end_before_start",
          affected,
          itemId: String(itemId),
          route: detailRoute,
          severity: "Error",
          message: `"${itemName}" ends before it starts.`,
          recommendedFix: "Review the start and end dates and correct the earlier/later value manually.",
          detectedAt,
        }));
      }
    }

    if (isStatusActive(deal.status) && isDealExpired({ end_date: String(deal.end_date || "N/A") }, now.getTime())) {
      issues.push(createIssue({
        type: "expired_deal_active",
        affected,
        itemId: String(itemId),
        route: detailRoute,
        severity: "Error",
        message: `"${itemName}" is expired but still marked active.`,
        recommendedFix: "Hide the deal by changing its status to Expired and revalidate affected pages.",
        detectedAt,
      }));
    }

    const claimUrl = deal.open_giveaway_url || deal.open_giveaway || deal.gamerpower_url;
    if (!isHttpUrl(claimUrl)) {
      issues.push(createIssue({
        type: "broken_claim_url",
        affected,
        itemId: String(itemId),
        route: detailRoute,
        severity: "Error",
        message: `"${itemName}" has a missing or invalid claim URL.`,
        recommendedFix: "Temporarily disable the claim link until a verified official storefront URL is available.",
        detectedAt,
      }));
    }

    if (isKnownEmpty(deal.thumbnail) && isKnownEmpty(deal.image)) {
      issues.push(createIssue({
        type: "missing_images",
        affected,
        itemId: String(itemId),
        route: detailRoute,
        severity: "Warning",
        message: `"${itemName}" has no thumbnail or image.`,
        recommendedFix: "Apply the site fallback image until a storefront image is available.",
        detectedAt,
      }));
    }

    if (hasDuplicatePlatformValues(String(deal.platforms || ""))) {
      issues.push(createIssue({
        type: "duplicate_platform_values",
        affected,
        itemId: String(itemId),
        route: detailRoute,
        severity: "Warning",
        message: `"${itemName}" has duplicate platform values: ${String(deal.platforms)}.`,
        recommendedFix: "Remove repeated platform values while preserving the original order.",
        detectedAt,
      }));
    }

    if (hasRepeatedTitleWords(String(deal.title || ""))) {
      issues.push(createIssue({
        type: "repeated_title_words",
        affected,
        itemId: String(itemId),
        route: detailRoute,
        severity: "Warning",
        message: `"${itemName}" has repeated adjacent words in its title.`,
        recommendedFix: "Clean adjacent duplicate words in the deal title.",
        detectedAt,
      }));
    }

    if (isKnownEmpty(deal.description)) {
      issues.push(createIssue({
        type: "missing_description",
        affected,
        itemId: String(itemId),
        route: detailRoute,
        severity: "Warning",
        message: `"${itemName}" has no useful description.`,
        recommendedFix: "Add a short original description before featuring or indexing this deal.",
        detectedAt,
      }));
    }
  }

  for (const [id, count] of idCounts) {
    if (count > 1) {
      issues.push(createIssue({
        type: "duplicate_external_ids",
        affected: `deal-id:${id}`,
        itemId: id,
        severity: "Critical",
        message: `External deal ID "${id}" appears ${count} times.`,
        recommendedFix: "Review duplicate records manually before deleting or merging anything.",
        detectedAt,
      }));
    }
  }

  for (const [slug, count] of slugCounts) {
    if (count > 1) {
      issues.push(createIssue({
        type: "duplicate_slugs",
        affected: `slug:${slug}`,
        itemId: slug,
        severity: "Error",
        message: `Generated slug "${slug}" appears ${count} times.`,
        recommendedFix: "Generate a unique safe slug for one duplicate item, then verify all links.",
        detectedAt,
      }));
    }
  }

  for (const check of input.apiChecks || []) {
    if (!check.ok) {
      issues.push(createIssue({
        type: "failed_api_request",
        affected: check.affected || check.name,
        severity: "Error",
        message: check.message,
        recommendedFix: "Retry the API sync. If it fails again, inspect provider status and logs.",
        detectedAt,
        metadata: { status: check.status ?? null, responseTimeMs: check.responseTimeMs ?? null },
      }));
    }

    if (typeof check.responseTimeMs === "number" && check.responseTimeMs > SLOW_API_THRESHOLD_MS) {
      issues.push(createIssue({
        type: "slow_api_response",
        affected: check.affected || check.name,
        severity: "Warning",
        message: `${check.name} responded in ${check.responseTimeMs}ms.`,
        recommendedFix: "Check provider latency and caching before increasing sync frequency.",
        detectedAt,
        metadata: { responseTimeMs: check.responseTimeMs },
      }));
    }
  }

  for (const linkCheck of input.brokenClaimLinks || []) {
    if (!linkCheck.ok) {
      issues.push(createIssue({
        type: "broken_claim_url",
        affected: linkCheck.affected || linkCheck.name,
        severity: "Error",
        message: linkCheck.message,
        recommendedFix: "Temporarily disable the claim link until it returns a healthy response.",
        detectedAt,
        metadata: { status: linkCheck.status ?? null, responseTimeMs: linkCheck.responseTimeMs ?? null },
      }));
    }
  }

  if (input.sitemapCheck && !input.sitemapCheck.ok) {
    issues.push(createIssue({
      type: "sitemap_failure",
      affected: input.sitemapCheck.affected || "sitemap.xml",
      route: "/sitemap.xml",
      severity: input.sitemapCheck.severity || "Error",
      message: input.sitemapCheck.message,
      recommendedFix: "Revalidate sitemap generation and confirm dynamic game URLs load.",
      detectedAt,
    }));
  }

  if (input.cacheCheck && !input.cacheCheck.ok) {
    issues.push(createIssue({
      type: "cache_revalidation_failure",
      affected: input.cacheCheck.affected || "revalidation",
      severity: input.cacheCheck.severity || "Error",
      message: input.cacheCheck.message,
      recommendedFix: "Retry route revalidation for the homepage, game pages, and sitemap.",
      detectedAt,
    }));
  }

  if (input.databaseCheck && !input.databaseCheck.ok) {
    issues.push(createIssue({
      type: "database_error",
      affected: input.databaseCheck.affected || "database",
      severity: input.databaseCheck.severity || "Critical",
      message: input.databaseCheck.message,
      recommendedFix: "Configure or repair the existing Upstash Redis connection before relying on persisted monitoring state.",
      detectedAt,
    }));
  }

  for (const envName of input.missingEnv || []) {
    issues.push(createIssue({
      type: "missing_required_env",
      affected: `env:${envName}`,
      severity: envName.includes("SECRET") || envName.includes("PASSWORD") ? "Critical" : "Warning",
      message: `Required environment variable ${envName} is not configured.`,
      recommendedFix: "Add the missing value in the deployment environment. The monitor never logs secret values.",
      detectedAt,
    }));
  }

  for (const article of input.articles || []) {
    const missingFields = [
      !article.seoTitle ? "SEO title" : null,
      !article.metaDescription ? "meta description" : null,
      !article.keywords?.length ? "keywords" : null,
      !article.ogTitle ? "OG title" : null,
      !article.ogDescription ? "OG description" : null,
    ].filter(Boolean);

    if (missingFields.length > 0) {
      issues.push(createIssue({
        type: "missing_seo_metadata",
        affected: `article:${article.slug}`,
        route: `/guides/${article.slug}`,
        severity: "Warning",
        message: `"${article.title}" is missing ${missingFields.join(", ")}.`,
        recommendedFix: "Add complete page-level SEO metadata before indexing this article.",
        detectedAt,
      }));
    }
  }

  return issues;
}

export function storeSystemHealthIssues(issues: SystemHealthIssue[]) {
  lastScanAt = new Date().toISOString();
  const currentById = new Map(storedIssues.map((issue) => [issue.id, issue]));
  storedIssues.length = 0;

  for (const issue of issues) {
    const previous = currentById.get(issue.id);
    storedIssues.push({
      ...issue,
      status: previous?.status === "Ignored" || previous?.status === "Resolved" ? previous.status : issue.status,
    });
  }

  return getSystemHealthIssues();
}

export function getSystemHealthIssues() {
  return storedIssues.slice();
}

export function getOpenSystemHealthIssues(limit = 10) {
  return storedIssues
    .filter((issue) => issue.status === "Open" || issue.status === "FixFailed")
    .sort((left, right) => severityRank(right.severity) - severityRank(left.severity))
    .slice(0, limit);
}

export function updateSystemHealthIssueStatus(issueId: string, status: Extract<IssueStatus, "Ignored" | "Resolved">) {
  const issue = storedIssues.find((candidate) => candidate.id === issueId);
  if (!issue) return null;
  issue.status = status;
  return issue;
}

function severityRank(severity: IssueSeverity) {
  return { Info: 0, Warning: 1, Error: 2, Critical: 3 }[severity];
}

function healthFromIssues(type: SystemHealthIssueType, disconnectedStatus = "Not checked") {
  const matching = storedIssues.filter((issue) => issue.type === type && issue.status !== "Resolved" && issue.status !== "Ignored");
  if (matching.length === 0) return disconnectedStatus;
  if (matching.some((issue) => issue.severity === "Critical" || issue.severity === "Error")) return "Error";
  return "Warning";
}

export function summarizeSystemHealth(): SystemHealthSummary {
  const today = new Date().toISOString().slice(0, 10);
  const openIssues = storedIssues.filter((issue) => issue.status === "Open" || issue.status === "FixFailed");

  return {
    totalOpen: openIssues.length,
    criticalIssues: openIssues.filter((issue) => issue.severity === "Critical").length,
    autoFixedToday: fixResults.filter((result) => result.success && result.createdAt.startsWith(today)).length,
    failedFixes: fixResults.filter((result) => !result.success).length,
    lastSystemScan: lastScanAt,
    apiHealth: summaryOverrides.apiHealth ?? healthFromIssues("failed_api_request", lastScanAt ? "Healthy" : "Not checked") as SystemHealthSummary["apiHealth"],
    databaseHealth: summaryOverrides.databaseHealth ?? healthFromIssues("database_error", lastScanAt ? "Healthy" : "Not checked") as SystemHealthSummary["databaseHealth"],
    cacheHealth: summaryOverrides.cacheHealth ?? healthFromIssues("cache_revalidation_failure", lastScanAt ? "Healthy" : "Not checked") as SystemHealthSummary["cacheHealth"],
  };
}

export function setSystemHealthSummaryOverrides(overrides: typeof summaryOverrides) {
  summaryOverrides = overrides;
}

function getDealSnapshot(deal: MutableGameDeal) {
  return cloneValue({
    id: deal.id,
    title: deal.title,
    thumbnail: deal.thumbnail,
    image: deal.image,
    open_giveaway_url: deal.open_giveaway_url,
    open_giveaway: deal.open_giveaway,
    platforms: deal.platforms,
    status: deal.status,
    active: deal.active,
    disabled: deal.disabled,
    hiddenReason: deal.hiddenReason,
    slug: deal.slug,
    claimUrlDisabled: deal.claimUrlDisabled,
  });
}

function restoreDealSnapshot(deal: MutableGameDeal, snapshot: unknown) {
  Object.assign(deal, snapshot);
}

function findDealForIssue(issue: SystemHealthIssue, deals: MutableGameDeal[]) {
  return deals.find((deal) => {
    if (issue.itemId !== undefined && String(deal.id) === String(issue.itemId)) return true;
    if (issue.itemId !== undefined && String(deal.external_id) === String(issue.itemId)) return true;
    return issue.affected === `deal:${deal.id}`;
  });
}

async function runOptionalValidation(issue: SystemHealthIssue, options: SafeFixOptions) {
  if (!options.validateOverride) return true;
  return options.validateOverride(issue);
}

function validateSafeFix(issue: SystemHealthIssue, deal?: MutableGameDeal) {
  switch (issue.type) {
    case "expired_deal_active":
      return Boolean(deal && !isStatusActive(deal.status));
    case "duplicate_platform_values":
      return Boolean(deal && !hasDuplicatePlatformValues(deal.platforms));
    case "repeated_title_words":
      return Boolean(deal && !hasRepeatedTitleWords(deal.title));
    case "missing_images":
      return Boolean(deal && (!isKnownEmpty(deal.thumbnail) || !isKnownEmpty(deal.image)));
    case "missing_safe_slug":
      return Boolean(deal?.slug);
    case "broken_claim_url":
      return Boolean(deal?.claimUrlDisabled);
    default:
      return true;
  }
}

function setIssueStatus(issue: SystemHealthIssue, status: IssueStatus) {
  issue.status = status;
  const stored = storedIssues.find((candidate) => candidate.id === issue.id);
  if (stored) stored.status = status;
}

export async function applySafeFix(issue: SystemHealthIssue, deals: MutableGameDeal[], options: SafeFixOptions = {}): Promise<SafeFixResult> {
  const actorEmail = options.actorEmail || "system";
  const actorRole = options.actorRole || "Owner";

  if (!issue.autoFixAllowed || issue.approvalRequired) {
    return {
      issueId: issue.id,
      success: false,
      rolledBack: false,
      message: "This issue requires owner review before automatic changes.",
    };
  }

  const deal = findDealForIssue(issue, deals);
  const previousValue = deal ? getDealSnapshot(deal) : null;
  fixSnapshots.unshift({
    issueId: issue.id,
    dealId: deal?.id,
    previousValue,
    createdAt: new Date().toISOString(),
  });

  addAuditLog({
    action: `system-health:${issue.type}:before-fix`,
    actorEmail,
    actorRole,
    targetType: issue.type,
    targetId: String(issue.itemId || issue.affected),
    severity: issue.severity,
    message: `Saved previous value before fixing ${issue.affected}.`,
    status: "Recorded",
    before: previousValue,
  });

  try {
    if (issue.type === "failed_api_request") {
      const retried = await options.retryApiSync?.();
      if (!retried) throw new Error("API retry did not return a successful result.");
    } else if (issue.type === "cache_revalidation_failure" || issue.type === "sitemap_failure") {
      const revalidated = await options.revalidateRoutes?.(["/", "/free-games", "/sitemap.xml"]);
      if (!revalidated) throw new Error("Route revalidation did not complete successfully.");
    } else if (!deal) {
      throw new Error("Affected deal was not found in the current data set.");
    } else if (issue.type === "expired_deal_active") {
      deal.status = "Expired";
      deal.active = false;
      deal.hiddenReason = "Expired deal hidden by system health auto-fix.";
    } else if (issue.type === "duplicate_platform_values") {
      deal.platforms = uniquePlatformValues(deal.platforms).join(", ");
    } else if (issue.type === "repeated_title_words") {
      deal.title = cleanRepeatedTitleWords(deal.title);
    } else if (issue.type === "missing_images") {
      deal.thumbnail = deal.thumbnail || FALLBACK_IMAGE;
      deal.image = deal.image || FALLBACK_IMAGE;
    } else if (issue.type === "missing_safe_slug") {
      deal.slug = safeSlug(deal.title || String(deal.id));
    } else if (issue.type === "broken_claim_url") {
      deal.claimUrlDisabled = true;
      deal.open_giveaway_url = "";
      deal.open_giveaway = "";
    }

    const valid = validateSafeFix(issue, deal) && await runOptionalValidation(issue, options);
    if (!valid) throw new Error("Validation failed after applying the automatic fix.");

    setIssueStatus(issue, "AutoFixed");
    fixResults.unshift({ success: true, createdAt: new Date().toISOString() });

    addAuditLog({
      action: `system-health:${issue.type}:fixed`,
      actorEmail,
      actorRole,
      targetType: issue.type,
      targetId: String(issue.itemId || issue.affected),
      severity: issue.severity,
      message: `Automatic fix completed for ${issue.affected}.`,
      status: "Succeeded",
      before: previousValue,
      after: deal ? getDealSnapshot(deal) : null,
    });

    return {
      issueId: issue.id,
      success: true,
      rolledBack: false,
      message: "Safe automatic fix completed.",
    };
  } catch (error) {
    if (deal && previousValue) restoreDealSnapshot(deal, previousValue);
    setIssueStatus(issue, "FixFailed");
    fixResults.unshift({ success: false, createdAt: new Date().toISOString() });

    addAuditLog({
      action: `system-health:${issue.type}:rollback`,
      actorEmail,
      actorRole,
      targetType: issue.type,
      targetId: String(issue.itemId || issue.affected),
      severity: "Error",
      message: `Automatic fix failed and was rolled back: ${error instanceof Error ? error.message : "Unknown error"}`,
      status: "RolledBack",
      before: previousValue,
      after: deal ? getDealSnapshot(deal) : null,
    });

    return {
      issueId: issue.id,
      success: false,
      rolledBack: true,
      message: error instanceof Error ? error.message : "Automatic fix failed.",
    };
  }
}

export function rollBackIssue(issueId: string, deals: MutableGameDeal[], actorEmail = "system", actorRole = "Owner") {
  const snapshot = fixSnapshots.find((candidate) => candidate.issueId === issueId);
  if (!snapshot) return false;

  const deal = deals.find((candidate) => String(candidate.id) === String(snapshot.dealId));
  if (!deal) return false;

  restoreDealSnapshot(deal, snapshot.previousValue);
  const issue = storedIssues.find((candidate) => candidate.id === issueId);
  if (issue) issue.status = "RolledBack";

  addAuditLog({
    action: "system-health:manual-rollback",
    actorEmail,
    actorRole,
    targetType: issue?.type || "system-health",
    targetId: String(issue?.itemId || issueId),
    severity: "Warning",
    message: `Manual rollback completed for ${issueId}.`,
    status: "RolledBack",
    after: getDealSnapshot(deal),
  });

  return true;
}

export function getFallbackImagePath() {
  return FALLBACK_IMAGE;
}

export function getHoursUntilExpiry(deal: Pick<GameDeal, "end_date">, now = Date.now()) {
  const expiryTime = getDealExpiryTime(deal.end_date);
  if (!Number.isFinite(expiryTime)) return null;
  return Math.round((expiryTime - now) / ONE_DAY_MS * 24);
}

export function resetSystemHealthForTests() {
  storedIssues.length = 0;
  fixSnapshots.length = 0;
  fixResults.length = 0;
  summaryOverrides = {};
  lastScanAt = null;
}
