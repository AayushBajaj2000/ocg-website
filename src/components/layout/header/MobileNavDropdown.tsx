import { useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, stagger, useReducedMotion, type Variants } from "motion/react";
import NavDropdownTriggerContent from "@/components/layout/header/NavDropdownTriggerContent";
import { useIsNavGroupActive } from "@/components/layout/hooks/useIsNavGroupActive";
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
  onNavigate: () => void;
};

const regionVariants: Variants = {
  closed: { height: 0, transition: { duration: 0.35, ease: DROPDOWN_EASE } },
  open: {
    height: "auto",
    transition: {
      duration: 0.45,
      ease: DROPDOWN_EASE,
      delayChildren: stagger(0.06, { startDelay: 0.1 }),
    },
  },
};

const regionReducedVariants: Variants = {
  closed: { height: 0, transition: { duration: 0 } },
  open: { height: "auto", transition: { duration: 0, delayChildren: stagger(0.03) } },
};

const MobileNavDropdown: React.FC<Props> = ({ link, onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isActive = useIsNavGroupActive(link);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const id = useId();
  const triggerId = `${id}-trigger`;
  const regionId = `${id}-region`;

  const region = prefersReducedMotion ? regionReducedVariants : regionVariants;
  const item = prefersReducedMotion ? dropdownItemReducedVariants : dropdownItemVariants;

  return (
    <div className="border-hairline border">
      <button
        type="button"
        id={triggerId}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-controls={regionId}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-2 p-4 text-sm transition-colors duration-300 ease-in-out motion-reduce:transition-none",
          isActive || isOpen ? "text-brand-blue" : "text-black-3",
        )}
      >
        <NavDropdownTriggerContent label={link.label} isActive={isActive} isOpen={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="region"
            id={regionId}
            role="region"
            aria-labelledby={triggerId}
            variants={region}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <ul className="border-t-hairline mx-4 border-t">
              {link.dropdownLinks?.map((dropdownLink) => {
                if (!dropdownLink.href) return null;
                const isCurrent = isHrefActive(pathname, dropdownLink.href);

                return (
                  <m.li
                    key={dropdownLink.title}
                    variants={item}
                    className="border-b-hairline border-b last:border-b-0"
                  >
                    <Link
                      href={dropdownLink.href}
                      prefetch={false}
                      onClick={onNavigate}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "flex items-start gap-3 py-4",
                        isCurrent ? "text-brand-blue" : "text-black-1",
                      )}
                    >
                      <span aria-hidden="true" className="shrink-0">
                        {dropdownLink.icon}
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-base tracking-[-2%]">{dropdownLink.title}</span>
                        <span className="text-black-3 text-sm tracking-[-2%]">
                          {dropdownLink.description}
                        </span>
                      </span>
                    </Link>
                  </m.li>
                );
              })}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavDropdown;
