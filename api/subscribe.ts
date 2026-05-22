import { sendJson } from "./_utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  const email = req.body?.email;
  if (!email || !String(email).includes("@")) {
    return sendJson(res, 400, { error: "Invalid email" });
  }

  return sendJson(res, 200, { message: "Subscribed successfully! Emails will be sent for new deals." });
}
