import "server-only";

import { createHash } from "node:crypto";
import { Resend } from "resend";
import type { LeadFormData } from "@/lib/lead";

const GUIDE_PATH = "/downloads/facility-supplies-audit-toolkit.pdf";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function messageKey(data: LeadFormData): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${data.email.toLowerCase()}|${data.organization.toLowerCase()}|${day}`)
    .digest("hex")
    .slice(0, 32);
}

export async function sendLeadMagnetEmails(
  data: LeadFormData,
  requestUrl: string,
): Promise<void> {
  const apiKey = requiredEnv("RESEND_API_KEY");
  const from = requiredEnv("RESEND_FROM_EMAIL");
  const notificationEmail = requiredEnv("LEAD_NOTIFICATION_EMAIL");
  const replyTo =
    process.env.RESEND_REPLY_TO_EMAIL?.trim() || notificationEmail;
  const resend = new Resend(apiKey);
  const guideUrl = new URL(GUIDE_PATH, requestUrl).toString();
  const key = messageKey(data);
  const safeName = escapeHtml(data.fullName);
  const safeOrganization = escapeHtml(data.organization);
  const safeFacility = escapeHtml(data.facilityType);
  const safeChallenge = escapeHtml(data.challenge || "Not specified");
  const safeWhatsapp = escapeHtml(data.whatsapp || "Not provided");
  const safeEmail = escapeHtml(data.email);

  const guideResult = await resend.emails.send(
    {
      from,
      to: data.email,
      replyTo,
      subject: "Your 30-Point Facility Supplies Audit Toolkit",
      html: `
        <div style="margin:0;background:#f4f8f6;padding:32px 16px;font-family:Arial,sans-serif;color:#1f2623">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #dbe8e1;border-radius:18px;overflow:hidden">
            <div style="background:#1b4d3a;padding:28px 32px;color:#ffffff">
              <div style="font-size:13px;font-weight:700;letter-spacing:.08em;color:#bfe0d1">ASHUTOSH TRADE</div>
              <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2">Your facility audit toolkit is ready</h1>
            </div>
            <div style="padding:30px 32px">
              <p style="font-size:16px;line-height:1.7;margin:0 0 18px">Hi ${safeName},</p>
              <p style="font-size:16px;line-height:1.7;margin:0 0 18px">Use this practical toolkit to identify cost leakage, stock risks, supply gaps, and cleaning-machinery downtime across ${safeOrganization}.</p>
              <p style="margin:26px 0;text-align:center">
                <a href="${guideUrl}" style="display:inline-block;background:#2a7a5a;color:#ffffff;text-decoration:none;font-weight:700;padding:15px 24px;border-radius:999px">Download the free audit toolkit</a>
              </p>
              <div style="background:#eaf4ef;border-radius:14px;padding:18px 20px;margin:24px 0">
                <strong>Start with three steps:</strong>
                <ol style="padding-left:20px;line-height:1.7;margin:10px 0 0">
                  <li>Complete the 30 YES/NO audit questions.</li>
                  <li>Circle the three NO answers creating the most risk.</li>
                  <li>Assign an owner and deadline in the 30-day plan.</li>
                </ol>
              </div>
              <p style="font-size:15px;line-height:1.7;margin:0">Reply to this email if you would like a free one-to-one review of your results.</p>
              <p style="font-size:15px;line-height:1.7;margin:20px 0 0">Ashutosh Trade<br>Housekeeping supplies, facility products, and cleaning machinery</p>
            </div>
          </div>
        </div>
      `,
      text: `Hi ${data.fullName},\n\nYour 30-Point Facility Supplies Audit Toolkit is ready:\n${guideUrl}\n\nComplete the 30 YES/NO questions, circle your three highest-risk NO answers, and assign an owner and deadline in the 30-day plan.\n\nReply if you would like a free one-to-one review of your results.\n\nAshutosh Trade`,
    },
    { idempotencyKey: `facility-audit-guide-${key}` },
  );

  if (guideResult.error) {
    throw new Error(`Guide email failed: ${guideResult.error.message}`);
  }

  const notificationResult = await resend.emails.send(
    {
      from,
      to: notificationEmail,
      replyTo: data.email,
      subject: `New facility audit lead: ${data.organization}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#1f2623;line-height:1.6">
          <h1 style="color:#1b4d3a">New lead magnet request</h1>
          <table style="border-collapse:collapse;width:100%;max-width:680px">
            <tr><td style="padding:10px;border:1px solid #dbe8e1;font-weight:700">Name</td><td style="padding:10px;border:1px solid #dbe8e1">${safeName}</td></tr>
            <tr><td style="padding:10px;border:1px solid #dbe8e1;font-weight:700">Organization</td><td style="padding:10px;border:1px solid #dbe8e1">${safeOrganization}</td></tr>
            <tr><td style="padding:10px;border:1px solid #dbe8e1;font-weight:700">Facility type</td><td style="padding:10px;border:1px solid #dbe8e1">${safeFacility}</td></tr>
            <tr><td style="padding:10px;border:1px solid #dbe8e1;font-weight:700">Main challenge</td><td style="padding:10px;border:1px solid #dbe8e1">${safeChallenge}</td></tr>
            <tr><td style="padding:10px;border:1px solid #dbe8e1;font-weight:700">Email</td><td style="padding:10px;border:1px solid #dbe8e1"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr><td style="padding:10px;border:1px solid #dbe8e1;font-weight:700">WhatsApp</td><td style="padding:10px;border:1px solid #dbe8e1">${safeWhatsapp}</td></tr>
          </table>
          <p>The requested guide email was sent successfully. The prospect consented to contact about the audit and relevant supply needs.</p>
        </div>
      `,
      text: `New facility audit lead\n\nName: ${data.fullName}\nOrganization: ${data.organization}\nFacility type: ${data.facilityType}\nMain challenge: ${data.challenge || "Not specified"}\nEmail: ${data.email}\nWhatsApp: ${data.whatsapp || "Not provided"}\n\nThe requested guide email was sent successfully.`,
    },
    { idempotencyKey: `facility-audit-notification-${key}` },
  );

  if (notificationResult.error) {
    throw new Error(`Lead notification failed: ${notificationResult.error.message}`);
  }
}
