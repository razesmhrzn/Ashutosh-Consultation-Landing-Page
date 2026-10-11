const benefits = [
  "See how many suppliers you can cut down to one",
  "See your supplier list and spending in one place",
  "Get one quote, one bill, and one WhatsApp contact",
  "Compare branded and generic options for your items",
  "Get free delivery and 5% off everything",
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
          What you get from the free check
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
