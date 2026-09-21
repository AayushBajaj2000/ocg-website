import FeatureRows, { type Feature } from "@/app/work/anesthesia-one/_components/FeatureRows";
import AOHeading from "@/app/work/anesthesia-one/_components/Heading";
import Section from "@/components/layout/sections/Section";

const SOLUTION_FEATURES: Feature[] = [
  {
    title: "Plain-language questions.",
    description:
      "No syntax to learn, no knowing which document to open first. Ask it the way you'd ask a colleague.",
    image: {
      src: "/anesthesia-one/assistant/solution-1.webp",
      alt: "Assistant composer replacing a manual guideline search",
    },
  },
  {
    title: "Cross-source synthesis.",
    description:
      "Where multiple sources bear on a question, the assistant brings them together into a single readable answer instead of handing over a reading list. Where sources differ, that's surfaced rather than smoothed over.",
    image: {
      src: "/anesthesia-one/assistant/solution-2.webp",
      alt: "Three guideline sources combined into one answer",
    },
  },
  {
    title: "Citations on every answer.",
    description:
      "Each claim traces to where it came from, one tap away. The assistant is a faster route to the guideline, not a replacement for it.",
    image: {
      src: "/anesthesia-one/assistant/solution-3.webp",
      alt: "Assistant answer with its cited source expanded",
    },
  },
  {
    title: "Honest limits.",
    description:
      'Outside the corpus, the answer is "this isn\'t covered here," not a guess. Anything that crosses from reference into clinical judgment is handed back to the clinician, explicitly.',
    image: {
      src: "/anesthesia-one/assistant/solution-4.webp",
      alt: "Assistant declining an uncovered question and handing a judgment call back",
    },
  },
  {
    title: "Built into the existing app.",
    description:
      "It sits alongside the calculators, algorithms and reference library already in the product, on the same data foundation, inside the same app.",
    image: {
      src: "/anesthesia-one/assistant/solution-5.webp",
      alt: "Assistant module beside the app's existing modules on one data foundation",
    },
  },
  {
    title: "Technical framing",
    description:
      "Source material is processed into a searchable knowledge layer. A question retrieves the passages that bear on it; a language model then reads only those passages and writes the answer, with references carried through to the interface. The model never answers from its own training. That one decision is what makes it safe enough to put in front of clinicians.",
    image: {
      src: "/anesthesia-one/assistant/solution-6.webp",
      alt: "Retrieval pipeline from sources to a cited answer",
    },
  },
];

const Solution: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-10 gap-4"
    >
      <AOHeading
        caption="Solution"
        captionWeight="regular"
        title="Retrieval first, synthesis second, citation always."
        titleClassName="font-normal!"
        description="The assistant is built on a retrieval-grounded architecture. A clinician's question is used to find the relevant passages across AnesthesiaOne's source material, and the answer is composed from those passages. The model handles comprehension and writing; the facts come from the sources."
      />
      <FeatureRows variant="assistant" features={SOLUTION_FEATURES} />
    </Section>
  );
};

export default Solution;
