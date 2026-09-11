import Section from "@/components/layout/Section";
import AskMe from "@/components/ui/AskMe";

const FaqSection: React.FC = () => {
  return (
    <Section
      container
      containerClassName="grid gap-12 lg:grid-cols-2 grid-cols-1 border-x border-x-hairline py-10 md:py-20"
    >
      <div className="flex flex-col gap-12">
        <h2 className="text-hero-mobile font-switzer max-w-110 font-medium text-black md:text-5xl">
          Have question? We've got answers!
        </h2>
        <AskMe />
      </div>
    </Section>
  );
};

export default FaqSection;
