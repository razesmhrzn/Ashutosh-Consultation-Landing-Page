# Ashutosh Trade landing page

A focused, mobile-first lead-generation landing page and thank-you page built with Next.js App Router, TypeScript, and Tailwind CSS v3.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The thank-you page is at [http://localhost:3000/thank-you](http://localhost:3000/thank-you).

On macOS or Linux, use `cp .env.example .env.local` instead of `copy`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | The public site origin, for example `https://example.com`. Used for canonical and Open Graph URLs. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | No | A URL that accepts the form fields as a JSON `POST`. |
| `NEXT_PUBLIC_VIMEO_URL` | No | A Vimeo share link in `https://vimeo.com/ID` or `https://vimeo.com/ID/HASH` format. It may include a `#t=` start time. |

> **Important:** leads are **not saved** when `NEXT_PUBLIC_FORM_ENDPOINT` is empty. In that mode the form waits briefly, simulates success, and redirects to `/thank-you`. Connect a real endpoint such as Formspree, Google Apps Script, or your own API before running ads.

The configured form endpoint receives this JSON shape:

```json
{
  "fullName": "",
  "email": "",
  "whatsapp": "",
  "businessName": "",
  "website": "",
  "message": ""
}
```

Your endpoint must return a `2xx` response for the submission to be treated as successful. If it lives on another origin, it must also allow this site through CORS.

The supplied Vimeo video is used by default. Set `NEXT_PUBLIC_VIMEO_URL` to another valid Vimeo link to replace it, or explicitly set it to an empty value to omit the video.

## Production build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this folder to a Git repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework preset as **Next.js**.
4. Add the environment variables above in **Project Settings → Environment Variables**.
5. Deploy, then set `NEXT_PUBLIC_SITE_URL` to the final production URL and redeploy so canonical and Open Graph URLs are correct.

The supplied ASTS logo is checked in at `public/logo.png` and is used in both page headers and Open Graph metadata.
