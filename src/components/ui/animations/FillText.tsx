"use client";

import { m, useTransform, type MotionValue } from "motion/react";

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

export const SPRING = { stiffness: 140, damping: 30, restDelta: 0.001 };

export const FILL_OFFSET = ["start 0.8", "end 0.5"] as const;

const FILL = ["#d0d5dd", "#131313"];

export const toWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);

const Word: React.FC<WordProps> = ({ word, range, progress }) => {
  const color = useTransform(progress, range, FILL);

  return <m.span style={{ color }}>{word}</m.span>;
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

export default FillText;
