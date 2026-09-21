import AOHeading from "@/app/work/anesthesia-one/_components/Heading";
import ResultsGrid, { type ResultItem } from "@/app/work/anesthesia-one/_components/ResultsGrid";
import Section from "@/components/layout/sections/Section";

const RESULTS: ResultItem[] = [
  {
    icon: { src: "/anesthesia-one/app/result-1.svg", width: 50.5, height: 71.1 },
    description: "Native iOS and Android apps live, from design through app store approval",
  },
  {
    icon: { src: "/anesthesia-one/app/result-2.svg", width: 52, height: 66.28 },
    description: "Web platform migrated to modern infrastructure and redesigned",
  },
  {
    icon: { src: "/anesthesia-one/app/result-3.svg", width: 52, height: 65.63 },
    description: "Complete brand identity delivered alongside the product",
  },
  {
    icon: { src: "/anesthesia-one/app/result-4.svg", width: 56, height: 70.68 },
    description: "Ongoing retainer for maintenance, feature work and analytics review",
  },
];

const Results: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-7 gap-4"
    >
      <AOHeading caption="Results" captionWeight="regular" />
      <ResultsGrid items={RESULTS} />
    </Section>
  );
};

export default Results;
