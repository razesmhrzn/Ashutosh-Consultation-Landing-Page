export const CTA_TEXT = "Email Me the Free Audit Toolkit";

export const WHATSAPP_NUMBER = "9779715556165";

export const WHATSAPP_MESSAGE =
  "Hi, I downloaded the Facility Supplies Audit Toolkit. I'd like help reviewing my results and supply needs.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    try {
      return new URL(configuredUrl);
    } catch {
      // Fall through to a stable local URL when the environment value is invalid.
    }
  }

  return new URL("http://localhost:3000");
}
