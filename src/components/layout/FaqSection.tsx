"use client";

import { useState } from "react";

import Section from "@/components/layout/Section";
import Accordion from "@/components/ui/Accordion";
import AskMe from "@/components/ui/AskMe";
import { Reveal } from "@/components/ui/Reveal";
import { StripeReveal } from "@/components/ui/StripeReveal";
import { FAQS } from "@/lib/constants";

const STEP = 0.06;
const ASK_ME_DELAY = STEP;
const FAQ_DELAY = STEP * 5;

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section
      container
      containerClassName="grid gap-12 lg:grid-cols-2 grid-cols-1 border-x border-x-hairline py-10 lg:py-20"
    >
      <div className="flex flex-col gap-12">
        <StripeReveal
          as="h2"
          className="text-hero-mobile mx-auto max-w-110 text-center font-medium text-black md:text-5xl lg:mx-0 lg:text-left"
        >
          Have question? We've got answers!
        </StripeReveal>
        <div className="hidden lg:block">
          <AskMe delay={ASK_ME_DELAY} step={STEP} />
        </div>
      </div>
      <div className="flex w-full flex-col gap-5">
        {FAQS.map((faq, index) => (
          <Reveal key={`${faq.question}-${index}`} delay={FAQ_DELAY + index * STEP}>
            <Accordion
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
            />
          </Reveal>
        ))}
      </div>
      <div className="lg:hidden">
        <AskMe delay={ASK_ME_DELAY} step={STEP} />
      </div>
    </Section>
  );
};

export default FaqSection;
