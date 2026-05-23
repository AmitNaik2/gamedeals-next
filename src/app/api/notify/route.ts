import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SubscribeBody {
  email: string;
  dealId?: string;
  dealTitle?: string;
}

// ── Transporter ───────────────────────────────────────────────────────────────
// Required .env.local variables:
//   EMAIL_HOST=smtp.gmail.com
//   EMAIL_PORT=587
//   EMAIL_USER=you@gmail.com
//   EMAIL_PASS=your-app-password    ← Gmail: generate at myaccount.google.com → Security → App Passwords
//   EMAIL_FROM="GamesDealsHub <noreply@gamesdealshub.me>"
//   ADMIN_EMAIL=you@gmail.com       ← Where YOU receive new subscriber alerts (optional)

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for SSL (465), false for TLS (587)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ── Email templates ───────────────────────────────────────────────────────────

function buildConfirmationEmail(
  email: string,
  dealTitle?: string
): nodemailer.SendMailOptions {
  return {
    from: process.env.EMAIL_FROM || "GamesDealsHub <noreply@gamesdealshub.me>",
    to: email,
    subject: "✅ You're subscribed to GamesDealsHub alerts!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;">
        <h1 style="color:#6366f1;margin-top:0;">🎮 GamesDealsHub</h1>
        <p style="font-size:16px;">Hey gamer! You're now subscribed to free game alerts.</p>
        ${
          dealTitle
            ? `<p style="font-size:14px;color:#aaa;">You'll be notified when deals like <strong style="color:#fff;">${dealTitle}</strong> go live.</p>`
            : ""
        }
        <p style="font-size:14px;color:#aaa;">
          We'll email you whenever a new free game drops on Epic, Steam, or GOG — before it expires.
        </p>
        <a href="https://www.gamesdealshub.me" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View Latest Deals →
        </a>
        <hr style="border-color:#222;margin:24px 0;" />
        <p style="font-size:12px;color:#555;">
          Don't want emails? Reply with "unsubscribe" and we'll remove you immediately.
        </p>
      </div>
    `,
  };
}

function buildAdminNotificationEmail(
  email: string,
  dealId?: string,
  dealTitle?: string
): nodemailer.SendMailOptions {
  return {
    from: process.env.EMAIL_FROM || "GamesDealsHub <noreply@gamesdealshub.me>",
    to: process.env.ADMIN_EMAIL,
    subject: `New subscriber: ${email}`,
    text: [
      "New GamesDealsHub subscription",
      `Email:      ${email}`,
      `Deal ID:    ${dealId || "N/A"}`,
      `Deal Title: ${dealTitle || "N/A"}`,
      `Time:       ${new Date().toISOString()}`,
    ].join("\n"),
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body: SubscribeBody = await request.json();
    const { email, dealId, dealTitle } = body;

    // Validate email presence
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Guard: ensure env vars are configured
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[notify] Missing EMAIL_HOST / EMAIL_USER / EMAIL_PASS in env");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const transporter = createTransporter();

    // Send confirmation to subscriber + optional admin alert in parallel
    await Promise.all([
      transporter.sendMail(buildConfirmationEmail(email, dealTitle)),
      process.env.ADMIN_EMAIL
        ? transporter.sendMail(buildAdminNotificationEmail(email, dealId, dealTitle))
        : Promise.resolve(),
    ]);

    console.log(`[notify] Subscribed: ${email} | Deal: ${dealId || "general"}`);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Check your inbox.",
    });
  } catch (error) {
    console.error("[notify] Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email. Please try again." },
      { status: 500 }
    );
  }
}
