"use client";

import { useId, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  stagger,
  useReducedMotion,
  type Variants,
} from "motion/react";
import NavDropdownTriggerContent from "@/components/layout/header/NavDropdownTriggerContent";
import { useHeaderDropdown } from "@/components/layout/hooks/useHeaderDropdown";
import { useIsNavGroupActive } from "@/components/layout/hooks/useIsNavGroupActive";
import { usePrefetchLatestContent } from "@/components/layout/hooks/useLatestContentCards";
import HeaderLatestCards from "@/components/layout/header/HeaderLatestCards";
import {
  DROPDOWN_EASE,
  dropdownItemReducedVariants,
  dropdownItemVariants,
} from "@/components/layout/header/headerDropdownMotion";
import { isHrefActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { INavLink } from "@/types";

type Props = {
  link: INavLink;
};

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
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const panelId = useId();
  // First hover/focus signals intent: fetch the latest cards (and warm their images) before the
  // panel opens, instead of on every page load.
  const prefetchLatestContent = usePrefetchLatestContent();

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
          onPointerEnter={prefetchLatestContent}
          onFocus={prefetchLatestContent}
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
                    {link.dropdownLinks?.map((dropdownLink) => {
                      if (!dropdownLink.href) return null;
                      const isCurrent = isHrefActive(pathname, dropdownLink.href);

                      return (
                        <m.li key={dropdownLink.title} variants={item}>
                          <Link
                            href={dropdownLink.href}
                            aria-current={isCurrent ? "page" : undefined}
                            className={cn(
                              "hover:bg-sunken border-b-hairline flex items-start gap-3 border-b px-5 py-5.5 transition-colors duration-300 ease-in-out",
                              isCurrent ? "text-brand-blue bg-sunken" : "text-black-1",
                            )}
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
                      );
                    })}
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
                <HeaderLatestCards itemVariants={item} />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default HeaderDropdown;
