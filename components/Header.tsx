import Image from "next/image";

export default function Header() {
  return (
    <header className="relative z-20 border-b border-deep-green/10 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-5 py-5 sm:px-8 sm:py-6">
        <Image
          src="/logo.png"
          alt="Ashutosh Trade"
          width={379}
          height={310}
          priority
          className="h-auto w-[112px] sm:w-[126px]"
        />
      </div>
    </header>
  );
}
