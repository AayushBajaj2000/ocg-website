import Section from "@/components/layout/sections/Section";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import Image from "next/image";

const HowWeWork: React.FC = () => {
  return (
    <Section as="section" container containerClassName="md:py-16 py-10 border-x">
      <div className="flex flex-col items-center gap-10 rounded-3xl bg-neutral-50 px-4 py-12 md:gap-16 md:px-8 md:pt-24 md:pb-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-switzer text-black-1 text-sm/5.25 font-medium tracking-[-0.5%] uppercase">
            How we work
          </span>
          <StripeReveal
            as="h2"
            className="md:text-hero-desktop text-hero-mobile font-switzer font-medium tracking-[-2%] text-black"
          >
            Integrated in your environment.
          </StripeReveal>
        </div>
        <Image
          src="/anesthesia-one/assistant/loop.webp"
          alt="Understand, build, show, adjust: a loop that runs inside your environment"
          width={1916}
          height={421}
          sizes="(min-width: 1024px) 958px, 100vw"
          className="w-full max-w-239.5"
        />
      </div>
    </Section>
  );
};

export default HowWeWork;
