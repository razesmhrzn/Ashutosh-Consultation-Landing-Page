import Image from "next/image";

export default function Header() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-8 sm:py-5">
        <Image
          src="/logo.png"
          alt="Ashutosh Trade"
          width={379}
          height={310}
          priority
          loading="eager"
          className="h-auto w-[112px] sm:w-[126px]"
        />
        <a
          href="/#get-toolkit"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-deep-green px-5 py-3 text-sm font-bold text-white shadow-button transition hover:-translate-y-0.5 hover:bg-primary hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary/30"
        >
          Get the free toolkit
        </a>
      </div>
    </header>
  );
}
