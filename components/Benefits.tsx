const benefits = [
  "A 30-point YES/NO audit across procurement, inventory, product control, machinery, and training",
  "A scoring guide that shows whether your operation is controlled, improving, or at high leakage risk",
  "A reorder-point worksheet for your ten most important consumables",
  "A weighted supplier comparison scorecard that goes beyond unit price",
  "A printable 30-day improvement plan with owners, deadlines, and success measures",
];

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="m6.5 12.5 3.25 3.25 7.75-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Benefits() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        <h2
          id="benefits-heading"
          className="max-w-md text-balance text-3xl font-bold leading-tight tracking-[-0.035em] text-ink sm:text-4xl"
        >
          What&apos;s inside the free toolkit
        </h2>

        <ul
          className="overflow-hidden rounded-[1.75rem] border border-deep-green/10 bg-white px-5 shadow-soft sm:px-7"
          role="list"
        >
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-4 border-b border-deep-green/10 py-5 last:border-0 sm:py-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-light-green text-primary">
                <CheckIcon />
              </span>
              <span className="pt-1 text-base font-semibold leading-7 text-ink sm:text-lg">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
