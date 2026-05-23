import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.EMAIL_PORT) || 587;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error("SMTP credentials missing in environment variables");
      return NextResponse.json({ error: 'Server misconfiguration: SMTP credentials missing.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${user}>`,
      to: user, // Send to yourself
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      text: `You have received a new message from GamesDealsHub Contact Form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // Check if it's an authentication error (likely due to Gmail requiring an App Password)
    let errorMessage = "Failed to send message.";
    if (error.code === 'EAUTH') {
        errorMessage = "Email authentication failed. If you are using Gmail, you MUST use a 16-character 'App Password' instead of your regular password. Google no longer supports standard passwords for SMTP.";
    }

    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
