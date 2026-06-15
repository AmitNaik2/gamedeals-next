import { createHmac, timingSafeEqual } from "crypto";

export type AdminRole = "Owner" | "Editor" | "Viewer";

export type AdminSession = {
  email: string;
  role: AdminRole;
  expiresAt: number;
};

export type SystemHealthAction =
  | "read"
  | "scan"
  | "fix-safe"
  | "ignore"
  | "mark-resolved"
  | "retry"
  | "rollback";

const SESSION_COOKIE = "gdh_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const systemHealthPermissions: Record<AdminRole, SystemHealthAction[]> = {
  Owner: ["read", "scan", "fix-safe", "ignore", "mark-resolved", "retry", "rollback"],
  Editor: ["read", "scan", "ignore", "mark-resolved", "retry"],
  Viewer: ["read"],
};

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.CRON_SECRET ||
    "local-development-admin-session-secret"
  );
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function safeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionToken(email: string, role: AdminRole = "Owner", now = Date.now()) {
  const session: AdminSession = {
    email,
    role,
    expiresAt: now + SESSION_TTL_MS,
  };
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

export function verifyAdminSessionToken(token?: string | null, now = Date.now()): AdminSession | null {
  if (!token || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEquals(signPayload(payload), signature)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!decoded.email || !decoded.role || decoded.expiresAt <= now) return null;
    if (!["Owner", "Editor", "Viewer"].includes(decoded.role)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function getAdminSessionCookieName() {
  return SESSION_COOKIE;
}

export function canUseSystemHealthAction(role: AdminRole, action: SystemHealthAction) {
  return systemHealthPermissions[role].includes(action);
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

function getCookieToken(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
  if (!sessionCookie) return null;

  return decodeURIComponent(sessionCookie.slice(SESSION_COOKIE.length + 1));
}

export function getAdminSessionFromRequest(request: Request) {
  return verifyAdminSessionToken(getBearerToken(request) || getCookieToken(request));
}

export function authorizeSystemHealthRequest(request: Request, action: SystemHealthAction) {
  const session = getAdminSessionFromRequest(request);
  if (!session || !canUseSystemHealthAction(session.role, action)) return null;
  return session;
}

export function isAuthorizedCronRequest(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.VERCEL_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}
