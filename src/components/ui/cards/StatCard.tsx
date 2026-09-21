"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  LazyMotion,
  domAnimation,
  m,
  useInView,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import { BulletIcon } from "@/components/icons/BulletIcon";
import Reveal from "@/components/ui/animations/Reveal";
import StripeReveal from "@/components/ui/animations/StripeReveal";
import type { IStatHighlight, IStatMetric, StatItem } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  stat: StatItem;
  index?: number;
  valueClassName?: string;
  borderClassName?: string;
};

type PlayProps = {
  play: boolean;
  delay: number;
  reduced: boolean;
};

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];
const ROLL_EASE: Transition["ease"] = [0.16, 1, 0.3, 1];
const STAGGER = 0.12;
const ROLL_DURATION = 1.6;
const ROLL_STEP = 0.25;

const cardVariants: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: (delay: number) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

const cardReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const Odometer: React.FC<PlayProps & { value: number | string; suffix?: string }> = ({
  value,
  suffix,
  play,
  delay,
  reduced,
}) => {
  const chars = String(value).split("");
  const settleDelay = delay + ROLL_DURATION * 0.55 + (chars.length - 1) * ROLL_STEP;

  return (
    <span aria-hidden className="inline-flex items-start tabular-nums">
      {chars.map((char, index) => {
        const digit = Number(char);
        if (Number.isNaN(digit)) return <span key={index}>{char}</span>;

        // Rightmost digits spin through extra full loops, like a real odometer.
        const loops = index;
        const cells = 10 * (loops + 1);
        const target = 10 * loops + digit;
        const duration = reduced ? 0 : ROLL_DURATION + index * ROLL_STEP;

        return (
          <span key={index} className="h-[1em] overflow-hidden">
            <m.span
              className="flex flex-col"
              initial={{ y: "0%" }}
              animate={
                play
                  ? {
                      y: `${(-target / cells) * 100}%`,
                      filter: reduced ? "blur(0px)" : ["blur(0px)", "blur(4px)", "blur(0px)"],
                    }
                  : undefined
              }
              transition={{
                y: { duration, delay, ease: ROLL_EASE },
                filter: { duration, delay, times: [0, 0.3, 1] },
              }}
            >
              {Array.from({ length: cells }, (_, cell) => (
                <span key={cell} className="h-[1em]">
                  {cell % 10}
                </span>
              ))}
            </m.span>
          </span>
        );
      })}
      {suffix && (
        <m.span
          initial={reduced ? false : { opacity: 0, y: "35%", rotate: -12 }}
          animate={play ? { opacity: 1, y: "0%", rotate: 0 } : undefined}
          transition={{ type: "spring", visualDuration: 0.5, bounce: 0.45, delay: settleDelay }}
          className="inline-block origin-bottom-left"
        >
          {suffix}
        </m.span>
      )}
    </span>
  );
};

const MetricContent: React.FC<
  PlayProps & { stat: IStatMetric; valueClassName?: string; borderClassName?: string }
> = ({ stat, valueClassName, borderClassName, ...play }) => {
  return (
    <div
      className={cn(
        "border-hairline relative flex size-full flex-col justify-between gap-10 p-5 md:gap-0",
        borderClassName ?? "border border-x-0 md:border-x",
      )}
    >
      <p
        className={cn(
          "font-switzer text-black-1 relative leading-none font-light tracking-[-5%]",
          valueClassName ?? "text-[4rem] md:text-[6.25rem]",
        )}
      >
        <span className="sr-only">
          {stat.value}
          {stat.suffix}
        </span>
        <Odometer value={stat.value} suffix={stat.suffix} {...play} />
      </p>

      <div className="font-switzer text-black-2 group-hover:text-brand-blue relative flex overflow-hidden text-sm tracking-[-2%] uppercase transition-colors duration-300">
        <span className="flex min-w-0 -translate-x-3.5 items-center gap-2 transition-transform duration-300 ease-in-out group-hover:translate-x-0 motion-reduce:transition-none">
          <BulletIcon className="size-1.5 shrink-0" />
          <StripeReveal
            as="span"
            delay={play.delay + 0.45}
            baseColor="var(--color-black-2)"
            accentColor={stat.accent ? "var(--color-brand-blue)" : "var(--color-hairline)"}
            className="text-xs"
          >
            {stat.label}
          </StripeReveal>
        </span>
      </div>
    </div>
  );
};

const HighlightContent: React.FC<PlayProps & { stat: IStatHighlight }> = ({
  stat,
  play,
  delay,
  reduced,
}) => {
  return (
    <div className="relative flex size-full flex-col justify-end overflow-hidden p-5">
      <m.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.25 }}
        animate={play ? { scale: 1 } : undefined}
        transition={{ duration: 1.6, delay, ease: EASE }}
      >
        <Image
          src={stat.image.url}
          alt={stat.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="eager"
        />
      </m.div>
      <span aria-hidden className="absolute inset-0 bg-linear-to-b from-black/0 to-black" />
      <Reveal
        as="p"
        byLine
        delay={delay + 0.5}
        className="font-switzer relative text-base font-medium tracking-[-2%] text-white"
      >
        {stat.label}
      </Reveal>
    </div>
  );
};

const StatCard: React.FC<Props> = ({ stat, index = 0, valueClassName, borderClassName }) => {
  const cardRef = useRef<HTMLLIElement>(null);
  const reduced = Boolean(useReducedMotion());
  const play = useInView(cardRef, { once: true, amount: 0.35 });
  const delay = index * STAGGER;
  const playProps = { play, delay, reduced };

  return (
    <LazyMotion features={domAnimation}>
      <li
        ref={cardRef}
        className={cn("group relative", {
          "md:h-107.5": stat._type === "metric",
          "h-107.5": stat._type !== "metric",
        })}
      >
        <m.div
          custom={delay}
          variants={reduced ? cardReducedVariants : cardVariants}
          initial="hidden"
          animate={play ? "visible" : "hidden"}
          className="size-full"
        >
          {stat._type === "metric" ? (
            <MetricContent
              stat={stat}
              valueClassName={valueClassName}
              borderClassName={borderClassName}
              {...playProps}
            />
          ) : (
            <HighlightContent stat={stat} {...playProps} />
          )}
        </m.div>
      </li>
    </LazyMotion>
  );
};

export default StatCard;
