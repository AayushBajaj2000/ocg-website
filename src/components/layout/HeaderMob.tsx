"use client";

import Image from "next/image";
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
import { BulletIcon } from "@/components/icons/BulletIcon";
import { MenuToggleIcon } from "@/components/icons/MenuToggleIcon";
import { NavLink } from "@/components/ui/NavLinks";
import { NAV_LINKS } from "@/lib/constants";
import { useMobileMenu } from "@/components/layout/hooks/useMobileMenu";

const PANEL_ID = "mobile-menu";

const DISCOVERY = {
  heading: "Prefer to discuss your project on live call?",
  subheading: "Start with a 25-minute discovery session instead",
  host: { name: "Austin Page", role: "Co-founder and Dev Lead", avatar: "/team/austin.png" },
  cta: { label: "Book a Discovery call", href: "#" },
} as const;

const EASE = [0.83, 0, 0.17, 1] as const;

const sheetVariants: Variants = {
  closed: { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.35, ease: EASE } },
  open: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.5, ease: EASE, delayChildren: stagger(0.12) },
  },
};

const rowVariants: Variants = {
  closed: { opacity: 0, y: 12, transition: { duration: 0.2 } },
  open: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

/** Reduced motion keeps the state change legible but drops the travel. */
const fadeVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { delayChildren: stagger(0.04) } },
};

const HeaderMob: React.FC = () => {
  const { isOpen, close, toggle } = useMobileMenu();
  const prefersReducedMotion = useReducedMotion();

  const sheet = prefersReducedMotion ? fadeVariants : sheetVariants;
  const row = prefersReducedMotion ? fadeVariants : rowVariants;

  return (
    <LazyMotion features={domAnimation}>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls={PANEL_ID}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="border-hairline bg-nav-button relative z-30 grid size-10 cursor-pointer place-items-center border"
        >
          <MenuToggleIcon isOpen={isOpen} className="size-5 text-black/60" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <m.div
                key="scrim"
                aria-hidden="true"
                onClick={close}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute inset-x-0 top-0 z-10 h-dvh bg-black/20"
              />

              <m.div
                key="sheet"
                id={PANEL_ID}
                variants={sheet}
                initial="closed"
                animate="open"
                exit="closed"
                className="border-hairline app-container absolute inset-x-0 top-0 z-20 max-h-dvh overflow-y-auto border-x border-b bg-white pt-18 md:pt-23.5"
              >
                <div className="px-4 pt-6 pb-4 md:px-5">
                  <nav aria-label="Mobile" className="mb-9.5">
                    <ul className="grid gap-4">
                      {NAV_LINKS.map((link) => (
                        <m.li key={link.label} variants={row}>
                          <NavLink
                            href={link.href}
                            prefetch={false}
                            onClick={close}
                            className="border-hairline group flex items-center gap-2 border p-4 text-sm"
                            activeClassName="text-brand-blue"
                            inactiveClassName="text-black-1"
                          >
                            {({ isActive }) => (
                              <>
                                <BulletIcon
                                  className={`size-1.5 transition-[margin,opacity] duration-300 ease-in-out ${!isActive && "-ml-1.5 opacity-0 group-hover:ml-0 group-hover:opacity-100"}`}
                                />
                                {link.label}
                              </>
                            )}
                          </NavLink>
                        </m.li>
                      ))}
                    </ul>
                  </nav>

                  <m.div variants={row} className="mb-6">
                    <h2 className="text-black-1 text-base font-medium">{DISCOVERY.heading}</h2>
                    <p className="text-black-3 mt-2 text-sm">{DISCOVERY.subheading}</p>
                  </m.div>

                  <m.div variants={row} className="border-hairline border p-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src={DISCOVERY.host.avatar}
                        alt=""
                        aria-hidden="true"
                        width={45}
                        height={45}
                        className="size-11.25 object-cover"
                      />
                      <div>
                        <p className="text-black-1 text-base font-medium">{DISCOVERY.host.name}</p>
                        <p className="text-black-3 text-sm">{DISCOVERY.host.role}</p>
                      </div>
                    </div>

                    <Link
                      href={DISCOVERY.cta.href}
                      onClick={close}
                      className="bg-brand-blue mt-6 flex h-10 items-center justify-center font-medium text-neutral-50"
                    >
                      {DISCOVERY.cta.label}
                    </Link>
                  </m.div>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default HeaderMob;
