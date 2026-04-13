import nodemailer from "nodemailer";
import { logger } from "./logger";

const GMAIL_USER = "Yasirlone831@gmail.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

export function createTransporter() {
  if (!GMAIL_APP_PASSWORD) {
    logger.warn("GMAIL_APP_PASSWORD not set — emails will not be sent");
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendPaymentNotification(data: {
  userName: string;
  userEmail: string;
  noteTitle: string;
  subject: string;
  classLevel: string;
  upiTransactionId: string;
  requestId: number;
  adminUrl: string;
}) {
  const transporter = createTransporter();
  if (!transporter) return;

  const approveUrl = `${data.adminUrl}/notes?adminApprove=${data.requestId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
      <div style="background: #064e3b; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 20px;">New Payment Request — Kashmir Portal</h2>
        <p style="margin: 6px 0 0; opacity: 0.8; font-size: 14px;">A student has paid and is requesting access to a note</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 140px;">Student Name</td>
            <td style="padding: 10px 0; font-weight: 600; color: #111827;">${data.userName}</td>
          </tr>
          <tr style="border-top: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Student Email</td>
            <td style="padding: 10px 0; font-weight: 600; color: #111827;">${data.userEmail}</td>
          </tr>
          <tr style="border-top: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Class</td>
            <td style="padding: 10px 0; font-weight: 600; color: #111827;">${data.classLevel}</td>
          </tr>
          <tr style="border-top: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Subject</td>
            <td style="padding: 10px 0; font-weight: 600; color: #111827;">${data.subject}</td>
          </tr>
          <tr style="border-top: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Note / Lesson</td>
            <td style="padding: 10px 0; font-weight: 600; color: #111827;">${data.noteTitle}</td>
          </tr>
          <tr style="border-top: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">UPI Transaction ID</td>
            <td style="padding: 10px 0; font-weight: 600; color: #111827; font-family: monospace;">${data.upiTransactionId}</td>
          </tr>
          <tr style="border-top: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Amount Paid</td>
            <td style="padding: 10px 0; font-weight: 600; color: #059669;">₹5.00</td>
          </tr>
          <tr style="border-top: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Request ID</td>
            <td style="padding: 10px 0; font-weight: 600; color: #111827;">#${data.requestId}</td>
          </tr>
        </table>

        <div style="margin-top: 28px; padding: 16px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: 600;">Action Required</p>
          <p style="margin: 0; font-size: 13px; color: #15803d;">
            Login to your admin panel on the Notes page and approve or reject this request. 
            Use password <strong>yasir123</strong> on the Study Notes page.
          </p>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af;">Kashmir Portal — Study Notes by Yasir Ferooz</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Kashmir Portal" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `[Payment Request #${data.requestId}] ${data.userName} — ${data.subject} (${data.classLevel})`,
      html,
    });
    logger.info({ requestId: data.requestId }, "Payment notification email sent");
  } catch (err) {
    logger.error({ err, requestId: data.requestId }, "Failed to send payment notification email");
  }
}

export async function sendApprovalEmail(data: {
  userEmail: string;
  userName: string;
  noteTitle: string;
  subject: string;
  classLevel: string;
  accessCode: string;
}) {
  const transporter = createTransporter();
  if (!transporter) return;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
      <div style="background: #064e3b; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 20px;">Your Access Has Been Approved!</h2>
        <p style="margin: 6px 0 0; opacity: 0.8; font-size: 14px;">Kashmir Portal — Study Notes by Yasir Ferooz</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="font-size: 16px; color: #111827;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #374151; line-height: 1.6;">
          Your payment for <strong>${data.noteTitle}</strong> (${data.subject}, ${data.classLevel}) 
          has been verified and your access has been approved.
        </p>

        <div style="margin: 24px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 2px solid #6ee7b7; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #059669; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Your Access Code</p>
          <p style="margin: 0; font-size: 28px; font-weight: 700; font-family: monospace; color: #064e3b; letter-spacing: 0.1em;">${data.accessCode}</p>
        </div>

        <p style="color: #374151; line-height: 1.6; font-size: 14px;">
          Go to the <strong>Study Notes</strong> page on Kashmir Portal, 
          enter your email and this access code to unlock and download your notes.
        </p>

        <div style="margin-top: 24px; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af;">Kashmir Portal — Study Notes by Yasir Ferooz</p>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">Best of luck with your studies!</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Kashmir Portal — Yasir Ferooz" <${GMAIL_USER}>`,
      to: data.userEmail,
      subject: `Access Approved — ${data.subject} Notes (${data.classLevel}) | Kashmir Portal`,
      html,
    });
    logger.info({ userEmail: data.userEmail }, "Approval email sent to student");
  } catch (err) {
    logger.error({ err, userEmail: data.userEmail }, "Failed to send approval email to student");
  }
}
