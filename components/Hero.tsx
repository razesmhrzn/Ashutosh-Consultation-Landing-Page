import Image from "next/image";
import { CTA_TEXT } from "@/lib/config";

function ArrowDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path d="M10 3.75v12.5m0 0 5-5m-5 5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolkitCover() {
  return (
    <div className="relative mx-auto w-full max-w-[390px] lg:mx-0 lg:ml-auto">
      <div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-full bg-light-green blur-3xl" />
      <div className="rotate-[1.5deg] overflow-hidden rounded-[1.75rem] border border-deep-green/10 bg-[#F7FAF8] shadow-panel">
        <div className="flex min-h-[500px]">
          <div className="w-5 shrink-0 bg-deep-green" />
          <div className="flex flex-1 flex-col p-7 sm:p-9">
            <Image
              src="/logo.png"
              alt=""
              width={379}
              height={310}
              loading="eager"
              className="h-auto w-28"
            />
            <p className="mt-10 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Free operational toolkit
            </p>
            <h2 className="mt-4 text-[2rem] font-extrabold leading-[1.08] tracking-[-0.045em] text-deep-green sm:text-[2.4rem]">
              The 30-Point Facility Supplies &amp; Cleaning Operations Audit
            </h2>
            <p className="mt-5 text-sm leading-6 text-muted">
              Find cost leakage, stock risks, supply gaps, and machinery downtime before they disrupt your facility.
            </p>
            <div className="mt-auto grid grid-cols-2 gap-2 pt-8 text-xs font-bold text-deep-green">
              {["30-point audit", "Reorder planner", "Supplier scorecard", "30-day action plan"].map((item) => (
                <span key={item} className="rounded-xl border border-deep-green/10 bg-white px-3 py-2.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-deep-green shadow-soft sm:-left-7">
        11 printable pages
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 mx-auto h-[680px] max-w-6xl bg-[radial-gradient(circle_at_22%_20%,rgba(42,122,90,0.14),transparent_56%)]" />
      <div className="hero-enter mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
            Free guide for facility decision-makers
          </p>
          <h1 id="hero-heading" className="mt-5 max-w-3xl text-balance text-[2.65rem] font-extrabold leading-[1.04] tracking-[-0.048em] text-ink sm:text-6xl lg:text-[4.25rem]">
            <span className="block">Too Many Suppliers?</span>
            <span className="block">Get Down to One.</span>
            <span className="mt-4 block text-[0.52em] leading-[1.15] tracking-[-0.035em] text-deep-green sm:mt-5">
              Find the hidden gaps in your facility supplies and cleaning operations.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-ink sm:text-xl">
            Free one-to-one check for you. See how to consolidate your housekeeping and facility supplies under one supplier.{" "}
            <strong className="font-semibold">
              Run a practical 30-point audit covering procurement, inventory, product control, cleaning machinery, training, and continuity.
            </strong>
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Sourcing Paper goods, Cleaning supplies, Housekeeping machinery, and Core facility essentials from multiple vendors creates unnecessary hassle. Evaluate products at your own pace, compare competitive pricing side-by-side, and select the right solutions for your operations. Built for hospitals, schools, hotels, commercial buildings, and offices. Complete it in about 15 minutes and leave with a focused 30-day action plan.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5 text-sm font-bold text-deep-green">
            <span className="rounded-full bg-light-green px-4 py-2">Cost leakage</span>
            <span className="rounded-full bg-light-green px-4 py-2">Stock risks</span>
            <span className="rounded-full bg-light-green px-4 py-2">Supplier control</span>
            <span className="rounded-full bg-light-green px-4 py-2">Machine uptime</span>
          </div>
          <a href="#get-toolkit" className="group mt-9 inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-center text-base font-bold text-white shadow-button transition duration-200 hover:-translate-y-0.5 hover:bg-deep-green hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary/30 sm:w-auto sm:px-8">
            {CTA_TEXT}
            <span className="transition-transform duration-200 group-hover:translate-y-0.5"><ArrowDownIcon /></span>
          </a>
          <p className="mt-4 text-sm text-muted">Free PDF. No newsletter subscription required.</p>
        </div>
        <ToolkitCover />
      </div>
    </section>
  );
}
