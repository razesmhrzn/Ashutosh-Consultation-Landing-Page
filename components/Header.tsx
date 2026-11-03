import Image from "next/image";

export default function Header({ logoOnly = false }: { logoOnly?: boolean }) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-deep-green/10 bg-white shadow-sm">
        <div className={`mx-auto flex max-w-6xl items-center gap-5 px-5 py-4 sm:px-8 sm:py-5 ${logoOnly ? "justify-center" : "justify-between"}`}>
          <Image
            src="/logo.png"
            alt="Ashutosh Trade"
            width={379}
            height={310}
            priority
            loading="eager"
            className="h-auto w-[112px] sm:w-[126px]"
          />
          {logoOnly ? null : (
            <a
              href="/#get-toolkit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-deep-green px-5 py-3 text-sm font-bold text-white shadow-button transition hover:-translate-y-0.5 hover:bg-primary hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary/30"
            >
              Get the free toolkit
            </a>
          )}
        </div>
      </header>
      <div aria-hidden="true" className="h-[124px] sm:h-[143px]" />
    </>
  );
}
