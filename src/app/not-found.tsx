import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/layout/sections/Section";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { Reveal } from "@/components/ui/animations/Reveal";
import { AnimatedIconButton } from "@/components/ui/buttons/AnimatedIconButton";
import { PlusIcon } from "@/components/icons";
import { bookingHref } from "@/lib/constants/booking";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found | OpenCore Group",
  description: "The page you're looking for doesn't exist or has moved.",
};

const CORNERS = [
  "top-6 left-6 -translate-x-1/2 -translate-y-1/2",
  "top-6 right-6 translate-x-1/2 -translate-y-1/2",
  "bottom-6 left-6 -translate-x-1/2 translate-y-1/2",
  "bottom-6 right-6 translate-x-1/2 translate-y-1/2",
];

/** Hairline "+" registration mark pinned to a corner of the blueprint frame. */
const CornerMark: React.FC<{ className: string }> = ({ className }) => (
  <span aria-hidden="true" className={cn("absolute z-10 size-3", className)}>
    <span className="bg-black-1 absolute inset-x-0 top-1/2 h-px -translate-y-1/2" />
    <span className="bg-black-1 absolute inset-y-0 left-1/2 w-px -translate-x-1/2" />
  </span>
);

const NotFound = () => (
  <Section as="section" container containerClassName="border-x py-6 md:py-10">
    <div className="relative">
      {CORNERS.map((corner) => (
        <CornerMark key={corner} className={corner} />
      ))}

      <div className="bg-blueprint-grid border-hairline relative isolate flex flex-col items-center justify-center gap-6 overflow-hidden border px-4 py-12 text-center md:px-10 md:py-20 lg:min-h-190">
        <span
          aria-hidden="true"
          className="font-switzer -z-10 text-[9rem] leading-none font-light tracking-[-0.06em] text-neutral-100 select-none md:text-[16rem] lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:text-[30rem]"
        >
          404
        </span>

        <div className="flex w-full max-w-260 flex-col items-center gap-4 md:gap-6">
          <p className="font-switzer bg-brand-blue/5 text-brand-blue flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium tracking-[-2%] md:text-base">
            <span aria-hidden="true" className="bg-brand-blue size-1.5 rotate-45" />
            Error 404
            <span aria-hidden="true">·</span>
            Page not found
          </p>

          <StripeReveal
            as="h1"
            className="text-hero-mobile md:text-hero-desktop text-black-1 font-medium tracking-[-4%] lg:text-7xl"
          >
            This page isn&apos;t on the blueprint.
          </StripeReveal>

          <Reveal
            as="p"
            className="font-switzer text-black-3 max-w-125 text-base tracking-[-2%] md:text-lg"
            delay={0.15}
            byLine
          >
            The link may be broken or the page has moved. Let&apos;s get you back to something we
            actually built.
          </Reveal>

          <div className="mt-2 flex w-full flex-col items-center gap-6 sm:w-auto sm:flex-row sm:gap-10">
            <AnimatedIconButton
              href="/"
              label="Back to home"
              icon={<PlusIcon className="size-5" />}
              wrapperClassName="w-full sm:w-auto"
              containerClassName="flex-1 sm:flex-none"
            />
            <Link
              href={bookingHref("not-found")}
              className="font-switzer text-black-1 hover:text-brand-blue focus-visible:text-brand-blue flex items-center gap-3 text-base tracking-[-2%] transition-colors duration-300 motion-reduce:transition-none"
            >
              <span className="underline underline-offset-4">Book a call</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

export default NotFound;
