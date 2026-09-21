import Hero from "@/app/work/anesthesia-one/_components/assistant/Hero";
import HowWeWork from "@/app/work/anesthesia-one/_components/assistant/HowWeWork";
import Problem from "@/app/work/anesthesia-one/_components/assistant/Problem";
import Process from "@/app/work/anesthesia-one/_components/assistant/Process";
import Results from "@/app/work/anesthesia-one/_components/assistant/Results";
import Solution from "@/app/work/anesthesia-one/_components/assistant/Solution";
import Section from "@/components/layout/sections/Section";
import PageDivider from "@/components/ui/dividers/PageDivider";
import FillHeading from "@/components/ui/headings/FillHeading";

const Assistant: React.FC = () => {
  return (
    <div className="bg-white">
      <Hero />
      <PageDivider />
      <Problem />
      <PageDivider />
      <Process />
      <PageDivider />
      <Solution />
      <PageDivider />
      <HowWeWork />
      <PageDivider />
      <Results />
      <PageDivider />
      <Section as="section" container containerClassName="md:py-24 py-16 border-x">
        <FillHeading
          text="Anyone can add AI to a product. In a clinical setting the work is deciding what it must never say, and building it so it can't."
          className="mx-auto max-w-266 text-center text-2xl! font-normal tracking-[-1%]! md:text-[2rem]/[2.8125rem]!"
        />
      </Section>
    </div>
  );
};

export default Assistant;
