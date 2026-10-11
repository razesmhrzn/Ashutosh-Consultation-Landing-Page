export const CTA_TEXT = "Book My Free Supplier Check";

export const WHATSAPP_NUMBER = "9779715556165";

export const WHATSAPP_MESSAGE =
  "Hi, I just submitted the form for the Free Supplier Consolidation Check. I'd like to know the next steps.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim() ?? "";

export const VIMEO_URL = process.env.NEXT_PUBLIC_VIMEO_URL?.trim() ?? "";

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

export function getVimeoEmbedUrl(value: string): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (hostname !== "vimeo.com" && hostname !== "www.vimeo.com") {
      return null;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const [videoId, hash, ...extraSegments] = segments;

    if (
      !videoId ||
      !/^\d+$/.test(videoId) ||
      extraSegments.length > 0 ||
      (hash && !/^[a-zA-Z0-9]+$/.test(hash))
    ) {
      return null;
    }

    const embedUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
    embedUrl.searchParams.set("autoplay", "0");

    if (hash) {
      embedUrl.searchParams.set("h", hash);
    }

    return embedUrl.toString();
  } catch {
    return null;
  }
}
