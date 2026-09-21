import AOHeading from "@/app/work/anesthesia-one/_components/Heading";
import Testimonial from "@/app/work/anesthesia-one/_components/Testimonial";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";

const PROBLEM_TEXTS = [
  "Anesthesia is one of the most protocol-dense specialties in medicine. The guidance is thorough because the margin for error is thin, and thoroughness has a cost. The answer to a specific clinical question is almost always written down somewhere. It is spread across several documents that were never designed to be cross-referenced, published by bodies that don't coordinate.",
  "So the work falls on the clinician. Remember which source covers this. Find it. Find the section. Then repeat, because a second source addresses the same question from a different angle and the two need reconciling. That's a research task, and it lands on someone who is between cases, or mid-case, and has minutes.",
  "The obvious fix, pointing a language model at it, is also the obvious way to cause harm. A model that answers from memory will eventually state a dose, a threshold or a contraindication that isn't in any guideline, and it will sound just as authoritative doing it. In this specialty a plausible wrong answer is more dangerous than no answer, because the value of a reference tool is that you can trust it without re-verifying.",
];

const Problem: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-10 gap-4"
    >
      <div className="max-w-181">
        <AOHeading
          caption="Problem"
          captionWeight="regular"
          title="The guidance exists. Finding it is the problem."
          titleClassName="md:text-[4rem]/[4.8rem]! font-semibold!"
        />
      </div>
      <div className="flex flex-col gap-4 md:gap-6">
        {PROBLEM_TEXTS.map((p, i) => (
          <div key={p} className="flex flex-col gap-6 rounded-3xl bg-neutral-50 p-6 md:p-8">
            <span className="font-switzer text-sm/5.25 font-medium tracking-[-0.5%] text-neutral-700">
              0{i + 1}
            </span>
            <Reveal as="p" className="font-switzer text-sm text-neutral-700" byLine>
              {p}
            </Reveal>
          </div>
        ))}
      </div>
      <Testimonial
        size="tall"
        quote="Worth a separate ask from the platform quote — the angle is trust: what it took for him to be comfortable putting an AI in front of clinicians. That's the most credible thing anyone can say about this feature."
        name="Dr. Sanjib Adhikary"
        role="AnesthesiaOne"
      />
    </Section>
  );
};

export default Problem;
