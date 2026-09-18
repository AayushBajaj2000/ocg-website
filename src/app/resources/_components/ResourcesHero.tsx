import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";

const ResourcesHero: React.FC = () => {
  return (
    <Section as="section" container containerClassName="border-x md:py-16 py-10">
      <div className="mx-auto flex max-w-149 flex-col gap-2.5 text-center md:gap-4">
        <StripeReveal
          as="h1"
          className="md:text-hero-desktop text-black-1 text-4xl font-medium tracking-[-2%]"
        >
          Opensource
        </StripeReveal>
        <Reveal
          as="p"
          className="font-switzer text-black-2 text-sm tracking-[-2%] md:text-base"
          byLine
          delay={1}
        >
          Skills, components, Figma files and starters we use on real client work – free to take,
          fork, and ship.
        </Reveal>
      </div>
    </Section>
  );
};

export default ResourcesHero;
