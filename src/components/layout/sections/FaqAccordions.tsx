"use client";

import { useState } from "react";

import Accordion from "@/components/ui/accordions/Accordion";
import { Reveal } from "@/components/ui/animations/Reveal";
import type { IFaq } from "@/types";

type Props = {
  faqs: IFaq[];
  /** Delay before the first accordion reveals; each one after follows by `step`. */
  delay: number;
  step: number;
};

const FaqAccordions: React.FC<Props> = ({ faqs, delay, step }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex w-full flex-col gap-5">
      {faqs.map((faq, index) => (
        <Reveal key={`${faq.question}-${index}`} delay={delay + index * step}>
          <Accordion
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
          />
        </Reveal>
      ))}
    </div>
  );
};

export default FaqAccordions;
