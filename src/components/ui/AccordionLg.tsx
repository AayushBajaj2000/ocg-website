import { useId } from "react";
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
import { PlusToggleIcon } from "@/components/icons/PlusToggleIcon";
import AutoplayVideo from "@/components/ui/AutoplayVideo";
import PortableContent from "@/components/ui/PortableContent";
import {
  dropdownItemReducedVariants,
  dropdownItemVariants,
} from "@/components/layout/headerDropdownMotion";
import { cn } from "@/lib/utils";
import type { IService, PortableTextComponents } from "@/types";

type Props = {
  index: number;
  service: IService;
  isOpen: boolean;
  onToggle: () => void;
};

const EASE = [0.32, 0.72, 0, 1] as const;

const DURATION = 0.42;

const regionVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: DURATION, ease: EASE },
      opacity: { duration: DURATION * 0.7, ease: "linear" },
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: DURATION, ease: EASE },
      opacity: { duration: DURATION * 0.7, ease: "linear" },
      delayChildren: stagger(0.06, { startDelay: 0.1 }),
    },
  },
};

const regionReducedVariants: Variants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0 } },
  open: { height: "auto", opacity: 1, transition: { duration: 0, delayChildren: stagger(0.03) } },
};

const createContentComponents = (item: Variants): PortableTextComponents => ({
  block: {
    normal: ({ children }) => (
      <m.p variants={item} className="text-neutral-900">
        {children}
      </m.p>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-4.5 text-neutral-600">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <m.li variants={item}>{children}</m.li>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value.href} className="underline underline-offset-4">
        {children}
      </a>
    ),
  },
});

const contentComponents = createContentComponents(dropdownItemVariants);

const contentReducedComponents = createContentComponents(dropdownItemReducedVariants);

const AccordionLg: React.FC<Props> = ({ index, service, isOpen, onToggle }) => {
  const prefersReducedMotion = useReducedMotion();
  const id = useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  const region = prefersReducedMotion ? regionReducedVariants : regionVariants;
  const item = prefersReducedMotion ? dropdownItemReducedVariants : dropdownItemVariants;
  const components = prefersReducedMotion ? contentReducedComponents : contentComponents;

  return (
    <LazyMotion features={domAnimation}>
      <div className="border-b-hairline border-b">
        <h2>
          <button
            type="button"
            id={triggerId}
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={panelId}
            className="font-switzer flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left text-2xl font-medium tracking-[-4%] md:py-10 md:text-5xl"
          >
            <span className="flex min-w-0 items-center gap-6 md:gap-10 lg:gap-25">
              <span aria-hidden="true" className="shrink-0 text-neutral-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-neutral-900">{service.title}</span>
            </span>
            <PlusToggleIcon
              isOpen={isOpen}
              className={cn(
                "size-4 shrink-0 transition-colors duration-300 md:size-8",
                isOpen ? "text-neutral-900" : "text-neutral-500",
              )}
            />
          </button>
        </h2>

        <AnimatePresence initial={false}>
          {isOpen && (
            <m.div
              key="panel"
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              variants={region}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-8 pb-8 lg:grid-cols-2 lg:gap-11">
                <m.div variants={item}>
                  <AutoplayVideo {...service.video} label={service.title} />
                </m.div>
                <div className="font-switzer flex flex-col justify-between gap-8 text-base tracking-[-2%] md:text-xl md:leading-7.5">
                  <div className="flex flex-col gap-8">
                    <PortableContent value={service.content} components={components} />
                  </div>
                  <m.div variants={item}>
                    <Link
                      href={service.cta.href}
                      className="text-neutral-600 underline underline-offset-4"
                    >
                      {service.cta.label}
                    </Link>
                  </m.div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default AccordionLg;
