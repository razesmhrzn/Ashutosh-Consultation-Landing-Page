import { CTA_TEXT } from "@/lib/config";

function ArrowDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M10 3.75v12.5m0 0 5-5m-5 5-5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 mx-auto h-[620px] max-w-5xl bg-[radial-gradient(circle_at_50%_14%,rgba(42,122,90,0.16),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-20 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-light-green/80 blur-3xl sm:h-80 sm:w-80"
      />

      <div className="hero-enter mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1
          id="hero-heading"
          className="max-w-4xl text-balance text-[2.65rem] font-extrabold leading-[1.06] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[4.75rem]"
        >
          Too Many Suppliers?{" "}
          <span className="text-primary">Get Down to One.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-balance text-lg font-semibold leading-8 text-ink sm:text-xl">
          Free one-to-one check for you. See how to consolidate your
          housekeeping and facility supplies under one supplier.
        </p>

        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
          Tissue from one shop. Chemicals from another. Machines from a third.
          Share your current suppliers and what you spend. We show you how to
          bring it all to one supplier.
        </p>

        <p className="mt-6 rounded-full border border-primary/15 bg-white/80 px-5 py-3 text-sm font-semibold leading-6 text-deep-green shadow-sm sm:text-base">
          Branded and generic options. Free delivery. 5% off everything.
        </p>

        <a
          href="#book"
          className="group mt-9 inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-center text-base font-bold text-white shadow-button transition duration-200 hover:-translate-y-0.5 hover:bg-deep-green hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary/30 sm:w-auto sm:px-8"
        >
          {CTA_TEXT}
          <span className="transition-transform duration-200 group-hover:translate-y-0.5">
            <ArrowDownIcon />
          </span>
        </a>
      </div>
    </section>
  );
}
