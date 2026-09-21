import AOHeading from "@/app/work/anesthesia-one/_components/Heading";
import ResultsGrid, { type ResultItem } from "@/app/work/anesthesia-one/_components/ResultsGrid";
import Section from "@/components/layout/sections/Section";

const RESULTS: ResultItem[] = [
  {
    icon: { src: "/anesthesia-one/assistant/result-1.svg", width: 45, height: 61.36 },
    description: "Live in the app, in front of practising clinicians",
  },
  {
    icon: { src: "/anesthesia-one/assistant/result-2.svg", width: 49.65, height: 60.62 },
    description:
      "Guideline lookup collapsed from a multi-source research task to a single question",
  },
  {
    icon: { src: "/anesthesia-one/assistant/result-3.svg", width: 47, height: 66.59 },
    description: "Every answer traceable to its source, with verification in one tap",
  },
  {
    icon: { src: "/anesthesia-one/assistant/result-4.svg", width: 52, height: 59.29 },
    description:
      "Extends the platform's value without touching the reliability of the calculators and algorithms underneath it",
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
