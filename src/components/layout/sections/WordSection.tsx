"use client";

import { useRef } from "react";
import { LazyMotion, domAnimation, useReducedMotion, useScroll, useSpring } from "motion/react";
import Section from "@/components/layout/sections/Section";
import FillText, { SPRING, toWords } from "@/components/ui/animations/FillText";
import FillHeading from "@/components/ui/headings/FillHeading";
import { WORD_SECTION } from "@/lib/constants";

const WordSection: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start 0.8", "end 0.5"] });
  const smoothProgress = useSpring(scrollYProgress, SPRING);
  const progress = shouldReduceMotion ? scrollYProgress : smoothProgress;

  const headingWords = toWords(WORD_SECTION.heading);
  const descriptionWords = toWords(WORD_SECTION.description);
  const total = headingWords.length + descriptionWords.length;

  return (
    <Section container containerClassName="lg:py-25 py-16 border-x">
      <LazyMotion features={domAnimation}>
        <div
          ref={targetRef}
          className="relative mx-auto flex max-w-257 flex-col gap-6 text-neutral-300 md:gap-10"
        >
          <FillHeading text={WORD_SECTION.heading} offset={0} total={total} progress={progress} />
          <p className="font-switzer text-sm tracking-[-1%] md:text-2xl">
            <span className="sr-only">{WORD_SECTION.description}</span>
            <FillText
              words={descriptionWords}
              offset={headingWords.length}
              total={total}
              progress={progress}
            />
          </p>
        </div>
      </LazyMotion>
    </Section>
  );
};

export default WordSection;
