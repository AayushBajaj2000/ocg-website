import { ElementType, ReactNode } from "react";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  title?: string;
  /** Extra classes for the title, e.g. to widen it past the default measure. */
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  children?: ReactNode;
};

const BannerHeading: React.FC<Props> = ({
  as = "h1",
  title,
  description,
  titleClassName,
  descriptionClassName,
  children,
}) => {
  return (
    <div className="z-50 flex w-full flex-wrap items-end justify-between gap-5 lg:flex-nowrap">
      <StripeReveal
        as={as}
        className={cn(
          "md:text-hero-desktop text-hero-mobile text-black-1 max-w-77.25 font-medium tracking-[-4%] md:max-w-125",
          titleClassName,
        )}
      >
        {title}
      </StripeReveal>
      <div
        className={cn({
          "flex flex-col gap-4 md:gap-6": children,
        })}
      >
        <Reveal
          as="p"
          className={cn(
            "text-black-3 max-w-77.25 text-sm tracking-[-2%] md:text-base lg:max-w-103.25",
            descriptionClassName,
          )}
          delay={0.15}
          distance="1.5rem"
          byLine
        >
          {description}
        </Reveal>
        {children}
      </div>
    </div>
  );
};

export default BannerHeading;
