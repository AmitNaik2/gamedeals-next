import { sendJson } from "./_utils";

export default async function handler(req: any, res: any) {
  const title = typeof req.query?.title === "string" ? req.query.title : "";
  if (!title) return sendJson(res, 400, { error: "Missing title query parameter" });

  return sendJson(res, 200, { not_found: true, reason: "igdb_not_configured" });
}
