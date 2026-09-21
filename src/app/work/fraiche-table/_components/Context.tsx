import Section from "@/components/layout/sections/Section";
import FillHeading from "@/components/ui/headings/FillHeading";

const CONTEXT_HEADING =
  "Fraîche Table is built on a real person's name, voice and reputation. Every pixel we shipped had to sound like her, and that shaped how we worked more than any technical requirement did.";

const Context: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-5 gap-4"
    >
      <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
        Context
      </span>
      <FillHeading text={CONTEXT_HEADING} className="md:text-h3! mx-auto font-medium" />
    </Section>
  );
};

export default Context;
