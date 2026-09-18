"use client";

import { useCallback, useId, useRef, type MouseEvent } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  stagger,
  useReducedMotion,
  type Variants,
} from "motion/react";
import BlogCard, { preloadBlogCardImage } from "@/components/ui/cards/BlogCard";
import NavDropdownTriggerContent from "@/components/layout/header/NavDropdownTriggerContent";
import { useHeaderDropdown } from "@/components/layout/hooks/useHeaderDropdown";
import { useIsNavGroupActive } from "@/components/layout/hooks/useIsNavGroupActive";
import {
  DROPDOWN_EASE,
  dropdownItemReducedVariants,
  dropdownItemVariants,
} from "@/components/layout/header/headerDropdownMotion";
import { cn } from "@/lib/utils";
import type { INavLink, INavLinkCard } from "@/types";

type Props = {
  link: INavLink;
};

export const LATEST_CARDS: INavLinkCard[] = [
  {
    img: { url: "/placeholders/work-main.webp", alt: "alt" },
    category: "Blog",
    headline: { text: "May 12, 2026" },
    title: "Most People Are Using Claude Wrong – Here's the Workflow That Changed Everything",
    href: "#",
    caption: { authorName: "Sameer Siddiqui", readTime: "2 min read" },
  },
  {
    img: { url: "/placeholders/work-main.webp", alt: "alt" },
    category: "Figma",
    headline: { icon: "file", text: ".fig" },
    title: "25+ Social Media Posts for Real Estate & Construction",
    href: "#",
    caption: { text: "Get it  →" },
  },
];

const CLIP_ORIGIN = "58% 0%";

const panelVariants: Variants = {
  closed: {
    clipPath: `circle(0% at ${CLIP_ORIGIN})`,
    transition: { duration: 0.4, ease: DROPDOWN_EASE },
  },
  open: {
    clipPath: `circle(125% at ${CLIP_ORIGIN})`,
    transition: {
      duration: 0.7,
      ease: DROPDOWN_EASE,
      delayChildren: stagger(0.05, { startDelay: 0.12 }),
    },
  },
};

const panelReducedVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.15 } },
  open: { opacity: 1, transition: { duration: 0.2, delayChildren: stagger(0.03) } },
};

const HeaderDropdown: React.FC<Props> = ({ link }) => {
  const { isOpen, close, toggle, containerRef, triggerRef } = useHeaderDropdown();
  const isActive = useIsNavGroupActive(link);
  const prefersReducedMotion = useReducedMotion();
  const panelId = useId();
  const hasPreloadedImages = useRef<boolean>(false);

  const preloadImages = useCallback(() => {
    if (hasPreloadedImages.current) return;
    hasPreloadedImages.current = true;
    LATEST_CARDS.forEach((card) => card.img && preloadBlogCardImage(card.img));
  }, []);

  const panel = prefersReducedMotion ? panelReducedVariants : panelVariants;
  const item = prefersReducedMotion ? dropdownItemReducedVariants : dropdownItemVariants;

  const closeOnNavigate = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) close();
  };

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={toggle}
          onPointerEnter={preloadImages}
          onFocus={preloadImages}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={cn(
            "group flex cursor-pointer items-center gap-2 transition-colors duration-300 ease-in-out outline-none motion-reduce:transition-none",
            isActive || isOpen ? "text-brand-blue" : "text-black-3",
          )}
        >
          <NavDropdownTriggerContent label={link.label} isActive={isActive} isOpen={isOpen} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <m.div
              key="panel"
              id={panelId}
              variants={panel}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeOnNavigate}
              className="border-hairline shadow-header-dropdown absolute top-10 -left-140 flex max-w-240 border bg-white xl:-left-156 xl:max-w-270"
            >
              <div className="border-r-hairline flex w-95 flex-col justify-between border-r pb-6">
                <div>
                  <m.p
                    variants={item}
                    className="text-black-3 border-b-hairline font-jetbrains-mono border-b px-5 py-4 text-xs tracking-[6%] uppercase"
                  >
                    {link.label}
                  </m.p>
                  <ul>
                    {link.dropdownLinks?.map(
                      (dropdownLink) =>
                        dropdownLink.href && (
                          <m.li key={dropdownLink.title} variants={item}>
                            <Link
                              href={dropdownLink.href}
                              className="text-black-1 hover:bg-sunken border-b-hairline flex items-start gap-3 border-b px-5 py-5.5 transition-colors duration-300 ease-in-out"
                            >
                              {dropdownLink.icon}
                              <span className="flex flex-col gap-0.5">
                                <span className="font-switzer text-base tracking-[-2%]">
                                  {dropdownLink.title}
                                </span>
                                <span className="font-switzer text-black-3 text-sm tracking-[-2%]">
                                  {dropdownLink.description}
                                </span>
                              </span>
                            </Link>
                          </m.li>
                        ),
                    )}
                  </ul>
                </div>
              </div>
              <div className="w-175">
                <m.p
                  variants={item}
                  className="text-black-3 border-b-hairline font-jetbrains-mono border-b px-5 py-4 text-xs tracking-[6%] uppercase"
                >
                  Latest from Opencore
                </m.p>
                <div className="divide-hairline grid grid-cols-2 divide-x">
                  {LATEST_CARDS.map((card) => (
                    <m.div key={card.title} variants={item}>
                      <BlogCard {...card} />
                    </m.div>
                  ))}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default HeaderDropdown;
