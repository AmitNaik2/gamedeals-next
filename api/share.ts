import { sendJson } from "./_utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  const { email, dealTitle, dealUrl } = req.body || {};
  if (!email || !dealTitle || !dealUrl) {
    return sendJson(res, 400, { error: "Missing parameters" });
  }

  return sendJson(res, 200, { message: "Deal shared successfully!" });
}
