"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  stagger,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  DRAW_EASING,
  DRAW_STYLES,
  drawKeyframes,
  hideShapes,
  loadSvg,
  parseSvg,
  type DrawTarget,
} from "@/components/ui/animations/drawSvg";
import { CarrotIcon, PlusIcon, QuoteIcon } from "@/components/icons";
import {
  dropdownItemReducedVariants,
  dropdownItemVariants,
} from "@/components/layout/header/headerDropdownMotion";
import { cn } from "@/lib/utils";
import type { ITrustedByClient, ITrustedByCta, ITrustedByLogo } from "@/types";

type Props = { client: ITrustedByClient; cta?: never } | { cta: ITrustedByCta; client?: never };

type Side = "top" | "bottom";

type Placement = { left: number; arrow: number; side: Side };

const GUTTER = 16;
const ARROW_INSET = 28;
const DRAW_DURATION = 1400;
const DRAW_SPREAD = 500;

const bubbleVariants: Variants = {
  closed: { opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: "easeIn" } },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      visualDuration: 0.35,
      bounce: 0.2,
      delayChildren: stagger(0.06, { startDelay: 0.05 }),
    },
  },
};

const bubbleReducedVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.1 } },
  open: { opacity: 1, transition: { duration: 0.2, delayChildren: stagger(0.03) } },
};

const drawShape = (target: DrawTarget, delay: number): Animation => {
  const { el } = target;
  const animation = el.animate(drawKeyframes(target), {
    duration: DRAW_DURATION,
    delay,
    easing: DRAW_EASING,
    fill: "forwards",
  });

  animation.finished
    .then(() => {
      DRAW_STYLES.forEach((prop) => el.style.removeProperty(prop));
      el.removeAttribute("pathLength");
      animation.cancel();
    })
    .catch(() => {});

  return animation;
};

const DrawnLogo: React.FC<{ logo: ITrustedByLogo }> = ({ logo }) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const idPrefix = `${useId().replace(/[^\w-]/g, "")}-`;
  const shouldReduceMotion = useReducedMotion();
  const isNear = useInView(hostRef, { once: true, margin: "200px" });
  const isVisible = useInView(hostRef, { once: true, amount: 0.6 });
  const [targets, setTargets] = useState<DrawTarget[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isNear) return;
    let cancelled = false;

    loadSvg(logo.url)
      .then((markup) => {
        const host = hostRef.current;
        const svg = parseSvg(markup, idPrefix);
        if (cancelled || !host) return;
        if (!svg) return setFailed(true);
        host.replaceChildren(svg);
        setTargets(shouldReduceMotion ? [] : hideShapes(svg));
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
    };
  }, [isNear, logo.url, idPrefix, shouldReduceMotion]);

  useEffect(() => {
    if (!isVisible || !targets?.length) return;
    const step = DRAW_SPREAD / Math.max(targets.length - 1, 1);
    const animations = targets.map((target, index) => drawShape(target, index * step));
    return () => animations.forEach((animation) => animation.cancel());
  }, [isVisible, targets]);

  return (
    <span
      role="img"
      aria-label={logo.alt}
      style={
        {
          "--logo-w": `${logo.width}px`,
          aspectRatio: `${logo.width} / ${logo.height}`,
        } as CSSProperties
      }
      className="relative block w-[calc(var(--logo-w)*0.6)] max-w-[80%] opacity-60 grayscale-100 transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-data-open:opacity-100 group-data-open:grayscale-0 md:w-(--logo-w)"
    >
      <span ref={hostRef} className="block size-full" />
      {failed && (
        <Image src={logo.url} alt="" fill sizes={`${logo.width}px`} className="object-contain" />
      )}
    </span>
  );
};

const TooltipBubble: React.FC<{
  anchorRef: RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
}> = ({ anchorRef, className, children }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [placement, setPlacement] = useState<Placement | null>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const bubble = bubbleRef.current;
    if (!anchor || !bubble) return;
    let frame = 0;

    const update = () => {
      const rect = anchor.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = bubble;
      const { clientWidth: viewportWidth, clientHeight: viewportHeight } = document.documentElement;
      const idealLeft = rect.width / 2 - width / 2;
      const minLeft = GUTTER - rect.left;
      const maxLeft = viewportWidth - GUTTER - width - rect.left;
      const left = Math.min(Math.max(idealLeft, minLeft), Math.max(maxLeft, minLeft));
      const spaceBelow = viewportHeight - rect.bottom;
      const side: Side = spaceBelow < height + GUTTER && rect.top > spaceBelow ? "top" : "bottom";
      const arrow = Math.min(Math.max(rect.width / 2 - left, ARROW_INSET), width - ARROW_INSET);
      setPlacement({ left, arrow, side });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, { capture: true });
    };
  }, [anchorRef]);

  const side = placement?.side ?? "bottom";

  return (
    <m.div
      ref={bubbleRef}
      variants={shouldReduceMotion ? bubbleReducedVariants : bubbleVariants}
      initial="closed"
      animate="open"
      exit="closed"
      style={{
        left: placement?.left ?? 0,
        transformOrigin: `${placement?.arrow ?? 0}px ${side === "bottom" ? "0%" : "100%"}`,
        visibility: placement ? "visible" : "hidden",
      }}
      className={cn(
        "bg-brand-blue font-switzer absolute z-20 rounded-2xl text-sm font-medium tracking-[-2%] text-white md:text-base",
        side === "bottom" ? "top-[calc(100%-6px)]" : "bottom-[calc(100%-6px)]",
        className,
      )}
    >
      <span
        aria-hidden
        style={{ left: placement?.arrow ?? 0 }}
        className={cn(
          "absolute flex -translate-x-1/2",
          side === "bottom" ? "-top-2.5" : "-bottom-2.5 rotate-180",
        )}
      >
        <CarrotIcon />
      </span>
      {children}
    </m.div>
  );
};

const TrustedByCard: React.FC<Props> = ({ client, cta }) => {
  const cardRef = useRef<HTMLLIElement>(null);
  const pointerTypeRef = useRef("");
  const bubbleId = useId();
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const item = shouldReduceMotion ? dropdownItemReducedVariants : dropdownItemVariants;
  const testimonial = client?.testimonial;
  const hasBubble = Boolean(cta || testimonial);

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: globalThis.PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [isOpen]);

  const onHover = (open: boolean) => (event: PointerEvent) => {
    if (hasBubble && event.pointerType !== "touch") setIsOpen(open);
  };

  const onFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.currentTarget.matches(":focus-visible")) setIsOpen(true);
  };

  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
  };

  return (
    <LazyMotion features={domAnimation}>
      <li
        ref={cardRef}
        data-open={isOpen || undefined}
        onPointerEnter={onHover(true)}
        onPointerLeave={onHover(false)}
        onPointerDown={(event) => (pointerTypeRef.current = event.pointerType)}
        onBlur={onBlur}
        onKeyDown={(event) => event.key === "Escape" && setIsOpen(false)}
        className="group relative h-12.5 data-open:z-20 md:h-20 lg:h-26"
      >
        <span
          aria-hidden
          className="absolute top-px right-0 bottom-0 left-px bg-neutral-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-open:opacity-100"
        />

        {cta ? (
          <Link
            href={cta.href}
            onFocus={onFocus}
            className="focus-visible:outline-brand-blue relative grid size-full place-items-center -outline-offset-2 focus-visible:outline-2"
          >
            <PlusIcon className="text-brand-blue size-4 md:size-6" />
            <span className="sr-only">
              {cta.label} {cta.linkLabel}
            </span>
            <AnimatePresence>
              {isOpen && (
                <TooltipBubble
                  anchorRef={cardRef}
                  className="w-max max-w-[calc(100vw-2rem)] px-4 py-3 md:px-6 md:py-5"
                >
                  <span aria-hidden className="flex flex-wrap gap-x-1">
                    <m.span variants={item}>{cta.label}</m.span>
                    <m.span variants={item} className="underline underline-offset-4">
                      {cta.linkLabel}
                    </m.span>
                  </span>
                </TooltipBubble>
              )}
            </AnimatePresence>
          </Link>
        ) : testimonial ? (
          <>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={bubbleId}
              onFocus={onFocus}
              onClick={() => pointerTypeRef.current === "touch" && setIsOpen((open) => !open)}
              className="focus-visible:outline-brand-blue relative grid size-full cursor-pointer place-items-center -outline-offset-2 focus-visible:outline-2"
            >
              <DrawnLogo logo={client.logo} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <TooltipBubble
                  anchorRef={cardRef}
                  className="w-[min(23.75rem,calc(100vw-2rem))] p-4 md:p-6"
                >
                  <figure id={bubbleId} className="flex flex-col gap-4 md:gap-6">
                    <m.blockquote variants={item}>
                      <p>“{testimonial.feedback}”</p>
                    </m.blockquote>
                    <figcaption className="flex items-center gap-2">
                      {testimonial.client?.img?.url && (
                        <m.span variants={item} className="shrink-0">
                          <Image
                            src={testimonial.client.img.url}
                            alt={testimonial.client.img.alt ?? ""}
                            width={48}
                            height={48}
                            className="size-10 rounded-full object-cover md:size-12"
                          />
                        </m.span>
                      )}
                      <m.span variants={item} className="flex flex-col font-normal">
                        <span>{testimonial.client?.name}</span>
                        <span className="text-sm">{testimonial.client?.role}</span>
                      </m.span>
                    </figcaption>
                  </figure>
                </TooltipBubble>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="relative grid size-full place-items-center">
            <DrawnLogo logo={client.logo} />
          </div>
        )}

        <QuoteIcon
          className={cn(
            "absolute right-2 bottom-2 h-auto w-2.5 transition-colors duration-300 md:right-4 md:bottom-4 md:w-4.5",
            isOpen ? "text-brand-blue" : "group-hover:text-brand-blue text-neutral-300",
          )}
        />
      </li>
    </LazyMotion>
  );
};

export default TrustedByCard;
