const problems = [
  "Many suppliers. Many delivery times. Many bills.",
  "Deliveries that come late or short when stock is low.",
  "Prices and quality that change without warning.",
  "No clear picture of what you really spend.",
];

export default function Problem() {
  return (
    <section
      aria-labelledby="problem-heading"
      className="px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-deep-green px-6 py-10 text-white shadow-panel sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[42px] border-white/[0.035]"
        />
        <div className="relative grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <h2
              id="problem-heading"
              className="text-balance text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              Does this sound like your week?
            </h2>
            <p className="mt-5 text-lg font-semibold text-[#BFE0D1]">
              There is an easier way.
            </p>
          </div>

          <ul className="divide-y divide-white/15" role="list">
            {problems.map((problem) => (
              <li
                key={problem}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#8ED1B1]"
                />
                <span className="text-base leading-7 text-white/90 sm:text-lg">
                  {problem}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
