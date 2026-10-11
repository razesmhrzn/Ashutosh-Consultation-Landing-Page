const steps = [
  {
    title: "Share your list",
    description: "Tell us your product list and monthly spend.",
  },
  {
    title: "We go through it with you",
    description: "A 1-on-1 call to discuss the products you require.",
  },
  {
    title: "Get your plan",
    description:
      "A plan to move to one supplier. Start with a small trial order.",
  },
];

export default function Process() {
  return (
    <section
      aria-labelledby="process-heading"
      className="bg-light-green/65 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="process-heading"
          className="text-center text-3xl font-bold tracking-[-0.035em] text-ink sm:text-4xl"
        >
          How it works
        </h2>

        <ol className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-soft sm:p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-[-0.02em] text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
