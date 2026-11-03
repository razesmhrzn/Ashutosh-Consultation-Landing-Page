import Benefits from "@/components/Benefits";
import CTAForm from "@/components/CTAForm";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Process from "@/components/Process";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="-mt-[15px]">
        <Hero />
        <Problem />
        <Benefits />
        <Process />
        <CTAForm />
      </main>
    </>
  );
}
