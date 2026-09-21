"use client";

import { ElementType, useRef } from "react";
import { LazyMotion, domAnimation, useMotionValue, type MotionValue } from "motion/react";
import Section, { SectionElement } from "@/components/layout/sections/Section";
import FillText, { toWords } from "@/components/ui/animations/FillText";
import ScrollProgress from "@/components/ui/animations/ScrollProgress";
import FillHeading from "@/components/ui/headings/FillHeading";
import { useScrollRoot } from "@/components/ui/hooks/useScrollRoot";
import { WORD_SECTION } from "@/lib/constants";
import type { IWordSection } from "@/types";
import { cn } from "@/lib/utils";

type Props = Partial<IWordSection> & {
  containerClassName?: string;
  as?: SectionElement;
  innerClassName?: string;
};

const WordSection: React.FC<Props> = ({
  heading = WORD_SECTION.heading,
  description = WORD_SECTION.description,
  containerClassName = "lg:py-25 py-16 border-x",
  as = "section",
  innerClassName,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollRoot = useScrollRoot(targetRef);
  const idleProgress = useMotionValue(0);

  const headingWords = toWords(heading);
  const descriptionWords = toWords(description);
  const total = headingWords.length + descriptionWords.length;

  const renderContent = (progress: MotionValue<number>) => (
    <>
      <FillHeading text={heading} offset={0} total={total} progress={progress} />
      <p className="font-switzer text-sm tracking-[-1%] md:text-2xl">
        <span className="sr-only">{description}</span>
        <FillText
          words={descriptionWords}
          offset={headingWords.length}
          total={total}
          progress={progress}
        />
      </p>
    </>
  );

  return (
    <Section as={as} container containerClassName={containerClassName}>
      <LazyMotion features={domAnimation}>
        <div
          ref={targetRef}
          className={cn(
            "relative mx-auto flex max-w-257 flex-col gap-6 text-neutral-300 md:gap-10",
            innerClassName,
          )}
        >
          {scrollRoot === undefined ? (
            renderContent(idleProgress)
          ) : (
            <ScrollProgress targetRef={targetRef} scrollRoot={scrollRoot}>
              {renderContent}
            </ScrollProgress>
          )}
        </div>
      </LazyMotion>
    </Section>
  );
};

export default WordSection;
