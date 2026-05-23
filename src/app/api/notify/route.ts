import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SubscribeBody {
  email: string;
  dealId?: string;
  dealTitle?: string;
}

// ── Nodemailer transporter ────────────────────────────────────────────────────
// Set these in your .env.local:
//   EMAIL_HOST=smtp.gmail.com
//   EMAIL_PORT=587
//   EMAIL_USER=you@gmail.com
//   EMAIL_PASS=your-app-password   ← Gmail: use an App Password, NOT your login password
//   EMAIL_FROM="GamesDealsHub <noreply@gamesdealshub.me>"
//   ADMIN_EMAIL=you@gmail.com      ← Where YOU receive new subscriber alerts

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ── Email templates ───────────────────────────────────────────────────────────

function buildConfirmationEmail(email: string, dealTitle?: string): nodemailer.SendMailOptions {
  return {
    from: process.env.EMAIL_FROM || "GamesDealsHub <noreply@gamesdealshub.me>",
    to: email,
    subject: "✅ You're subscribed to GamesDealsHub alerts!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;">
        <h1 style="color:#6366f1;margin-top:0;">🎮 GamesDealsHub</h1>
        <p style="font-size:16px;">Hey gamer! You're now subscribed to free game alerts.</p>
        ${dealTitle ? `<p style="font-size:14px;color:#aaa;">You'll be notified when deals like <strong style="color:#fff;">${dealTitle}</strong> go live.</p>` : ""}
        <p style="font-size:14px;color:#aaa;">We'll email you whenever a new free game drops on Epic, Steam, or GOG — before it expires.</p>
        <hr style="border-color:#222;margin:24px 0;" />
        <p style="font-size:12px;color:#555;">
          Don't want emails? Just ignore this — you can also unsubscribe by replying with "unsubscribe".
        </p>
      </div>
    `,
  };
}

function buildAdminNotificationEmail(email: string, dealId?: string, dealTitle?: string): nodemailer.SendMailOptions {
  return {
    from: process.env.EMAIL_FROM || "GamesDealsHub <noreply@gamesdealshub.me>",
    to: process.env.ADMIN_EMAIL,
    subject: `New subscriber: ${email}`,
    text: `New subscription\nEmail: ${email}\nDeal ID: ${dealId || "N/A"}\nDeal Title: ${dealTitle || "N/A"}\nTime: ${new Date().toISOString()}`,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body: SubscribeBody = await request.json();
    const { email, dealId, dealTitle } = body;

    // Validation
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Check env vars are set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[notify] Missing EMAIL_HOST / EMAIL_USER / EMAIL_PASS env vars");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const transporter = createTransporter();

    // Send both emails in parallel
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
    console.error("[notify] Failed to send notification email:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email. Please try again." },
      { status: 500 }
    );
  }
}
