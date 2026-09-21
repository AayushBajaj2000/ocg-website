import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

const Heading: React.FC<Props> = ({ title, subtitle, titleClassName, subtitleClassName }) => {
  return (
    <>
      {title && (
        <StripeReveal
          as="h1"
          className={cn(
            "md:text-hero-desktop text-hero-mobile font-switzer text-black-1 max-w-237.5 font-medium tracking-[-2%]",
            titleClassName,
          )}
        >
          {title}
        </StripeReveal>
      )}
      {subtitle && (
        <Reveal
          as="p"
          className={cn(
            "text-black-3 font-switzer max-w-237.5 text-sm tracking-[-2%] md:text-xl",
            subtitleClassName,
          )}
          byLine
        >
          {subtitle}
        </Reveal>
      )}
    </>
  );
};

export default Heading;
