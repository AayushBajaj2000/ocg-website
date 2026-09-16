"use client";

import { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Section from "@/components/layout/sections/Section";
import { WORD_SECTION } from "@/lib/constants";

type FillTextProps = {
  words: string[];
  offset: number;
  total: number;
  progress: MotionValue<number>;
};

type WordProps = {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
};

const SPRING = { stiffness: 140, damping: 30, restDelta: 0.001 };

const toWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);

const Word: React.FC<WordProps> = ({ word, range, progress }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative">
      {word}
      <m.span style={{ opacity }} className="text-black-1 absolute inset-0">
        {word}
      </m.span>
    </span>
  );
};

const FillText: React.FC<FillTextProps> = ({ words, offset, total, progress }) => {
  return (
    <span aria-hidden>
      {words.map((word, index) => {
        const start = (offset + index) / total;
        return (
          <span key={index}>
            <Word word={word} range={[start, start + 1 / total]} progress={progress} />{" "}
          </span>
        );
      })}
    </span>
  );
};

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
          <h2 className="md:text-hero-mobile font-switzer text-xl">
            <span className="sr-only">{WORD_SECTION.heading}</span>
            <FillText words={headingWords} offset={0} total={total} progress={progress} />
          </h2>
          <p className="font-switzer text-sm md:text-2xl">
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
