import { cn } from "@/lib/utils";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import Image from "next/image";

const OUTCOME_CARDS = [
  {
    title: "One system of record",
    description:
      "Projects, financials, and documents in one place instead of scattered across tools that don't talk",
  },
  {
    title: "Their process, not a vendor’s",
    description:
      "Features built for how flooring works: schedules of values, sample transmittals, change orders. No more workarounds bolted onto generic software.",
  },
  {
    title: "An asset on the balance sheet",
    description:
      "Software the business owns and controls, and the data to go with it. That’s enterprise value, not an expense line.",
  },
];

export const PFHeading: React.FC<{
  caption?: string;
  title?: string;
  description?: string;
  titleClassName?: string;
  captionClassName?: string;
  descriptionClassName?: string;
}> = ({ caption, title, description, titleClassName, captionClassName, descriptionClassName }) => {
  return (
    <div className="flex flex-col gap-4">
      {caption && (
        <span
          className={cn(
            "font-switzer text-xs font-medium tracking-[-2%] text-black uppercase sm:text-sm",
            captionClassName,
          )}
        >
          {caption}
        </span>
      )}
      {title && (
        <StripeReveal
          as="h2"
          className={cn(
            "md:text-h3 font-switzer text-2xl font-medium tracking-[-2%]",
            titleClassName,
          )}
        >
          {title}
        </StripeReveal>
      )}
      {description && (
        <Reveal
          as="p"
          className={cn(
            "font-switzer text-black-3 text-sm tracking-[-2%] md:text-base",
            descriptionClassName,
          )}
          byLine
        >
          {description}
        </Reveal>
      )}
    </div>
  );
};

const Outcome: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-8 gap-4"
    >
      <div className="max-w-196.5">
        <PFHeading
          caption="Outcome"
          title="One system of record, built for how flooring actually works."
          description="They came to us running the business across five systems that didn't talk to each other. We replaced the whole stack with one piece of software they own – with the financial layer integrated rather than reconciled."
        />
      </div>
      <div>
        <div>
          <Image
            src="/page-flooring/platform/outcome.webp"
            alt="outcome"
            width={1430}
            height={620}
            className="hidden object-cover sm:block"
          />
          <Image
            src="/page-flooring/platform/outcome-mob.webp"
            alt="outcome"
            width={1430}
            height={620}
            className="object-cover sm:hidden"
          />
        </div>
        <div className="border-hairline grid grid-cols-1 lg:grid-cols-3 lg:border-x lg:border-b lg:bg-white">
          {OUTCOME_CARDS.map((c, i) => (
            <div
              key={`${c.title}-${i}`}
              className="border-hairline flex flex-col gap-3 border-t py-4 first:border-t-0 last:border-r-0 lg:border-t-0 lg:border-r lg:px-7 lg:py-7.5"
            >
              <p className="font-switzer text-black-1 text-base font-semibold tracking-[-2%] md:text-xl">
                {c.title}
              </p>
              <span className="font-switzer text-black-3 text-xs tracking-[-2%] md:text-sm">
                {c.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Outcome;
