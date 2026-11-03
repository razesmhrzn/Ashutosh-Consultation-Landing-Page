# Ashutosh Trade lead-magnet landing page

A mobile-first lead-generation funnel built with Next.js App Router, TypeScript, and Tailwind CSS. Prospects request the free **30-Point Facility Supplies & Cleaning Operations Audit**, receive it by email, and are forwarded to a thank-you page with a backup download and WhatsApp follow-up.

## Lead flow

1. A prospect submits their name, work email, organization, facility type, WhatsApp number, and primary challenge.
2. The server validates and rate-limits the request.
3. Resend emails the audit toolkit to the prospect.
4. Resend emails the captured lead details to the configured Ashutosh Trade inbox.
5. The prospect reaches `/thank-you`, where a backup download remains available.

The PDF served by the site is at `public/downloads/facility-supplies-audit-toolkit.pdf`. Its print-ready source artifact is generated under `output/pdf/` by `scripts/generate_lead_magnet.py`.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On macOS or Linux, use `cp .env.example .env.local` instead of `copy`.

## Email setup

This project uses Resend's server-side Next.js integration. Verify a sending subdomain such as `updates.ashutoshtrade.com.np` in Resend, then set these variables in Vercel:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site origin used for canonical and social metadata. |
| `RESEND_API_KEY` | Yes | Secret Resend API key. Never expose it with a `NEXT_PUBLIC_` prefix. |
| `RESEND_FROM_EMAIL` | Yes | Verified sender, for example `Ashutosh Trade <guides@updates.ashutoshtrade.com.np>`. |
| `LEAD_NOTIFICATION_EMAIL` | Yes | Ashutosh Trade inbox that receives each lead's contact and qualification details. |
| `RESEND_REPLY_TO_EMAIL` | No | Inbox prospects should reply to. Defaults to `LEAD_NOTIFICATION_EMAIL`. |

The form intentionally returns an error instead of pretending success when email delivery is not configured.

## Production build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. Allow the connected Vercel project to build the new commit.
3. Add the environment variables above under **Project Settings -> Environment Variables**.
4. Redeploy after adding or changing environment variables.
5. Submit a real test lead and confirm both the prospect email and internal lead notification arrive.

The Resend sender should use a separate email subdomain. Do not add email records directly to `buy.ashutoshtrade.com.np`, because that hostname is already a CNAME for the Vercel site.
