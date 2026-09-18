import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

const SectionHeading: React.FC<Props> = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
}) => {
  return (
    <div className="flex flex-col gap-4 text-center">
      <StripeReveal
        as="h2"
        className={cn(
          "text-black-1 font-switzer md:text-hero-desktop text-hero-mobile font-medium tracking-[-2%]",
          titleClassName,
        )}
      >
        {title}
      </StripeReveal>
      <Reveal
        as="p"
        byLine
        className={cn(
          "font-switzer text-black-2 mx-auto max-w-lg text-sm tracking-[-2%] md:text-base",
          descriptionClassName,
        )}
      >
        {description}
      </Reveal>
    </div>
  );
};

export default SectionHeading;
