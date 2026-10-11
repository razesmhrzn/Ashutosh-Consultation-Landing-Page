import type { Metadata } from "next";
import Header from "@/components/Header";
import {
  FORM_ENDPOINT,
  getVimeoEmbedUrl,
  VIMEO_URL,
  WHATSAPP_URL,
} from "@/lib/config";

export const metadata: Metadata = {
  title: "Thank You | Ashutosh Trade",
  robots: {
    index: false,
    follow: false,
  },
};

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.55 0 .22 5.33.22 11.88c0 2.1.55 4.15 1.6 5.95L.12 24l6.31-1.66a11.9 11.9 0 0 0 5.67 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.16-3.47-8.42ZM12.1 21.78h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.75.99 1-3.65-.24-.38a9.86 9.86 0 0 1-1.51-5.27C2.19 6.43 6.64 2 12.11 2a9.8 9.8 0 0 1 7 2.9 9.83 9.83 0 0 1 2.9 7c0 5.45-4.45 9.88-9.91 9.88Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9.03 9.03 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.93-2.22-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.5.71.3 1.27.49 1.7.63.72.23 1.36.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35Z" />
    </svg>
  );
}

export default function ThankYouPage() {
  const vimeoEmbedUrl = getVimeoEmbedUrl(VIMEO_URL);

  return (
    <>
      <Header />
      <main className="relative isolate min-h-[calc(100vh-94px)] overflow-hidden px-5 py-14 sm:px-8 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 mx-auto h-[560px] max-w-5xl bg-[radial-gradient(circle_at_50%_10%,rgba(42,122,90,0.17),transparent_65%)]"
        />

        <section
          aria-labelledby="thank-you-heading"
          className="mx-auto max-w-3xl text-center"
        >
          <h1
            id="thank-you-heading"
            className="text-balance text-[2.5rem] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink sm:text-6xl"
          >
            Congratulations!{" "}
            <span className="text-primary">You&apos;re one step closer.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
            Next steps: watch the short video below, then message us on WhatsApp.
          </p>
          {FORM_ENDPOINT ? (
            <p className="mt-3 text-base font-semibold text-deep-green">
              Your request for the free Supplier Check is submitted.
            </p>
          ) : null}

          {vimeoEmbedUrl ? (
            <div className="mt-9 aspect-video overflow-hidden rounded-[1.5rem] border border-deep-green/10 bg-deep-green shadow-panel sm:rounded-[2rem]">
              <iframe
                src={vimeoEmbedUrl}
                title="Ashutosh Trade next steps video"
                className="h-full w-full"
                allow="fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-9 inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-3 rounded-full bg-whatsapp px-6 py-4 text-base font-bold text-white shadow-button transition duration-200 hover:-translate-y-0.5 hover:bg-[#188C47] hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-whatsapp/30 sm:w-auto sm:px-8"
          >
            <WhatsAppIcon />
            Message Us on WhatsApp
          </a>
        </section>
      </main>
    </>
  );
}
