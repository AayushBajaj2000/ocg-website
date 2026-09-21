import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";

type Props = {
  title?: string;
  subtitle?: string;
};

const Heading: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <>
      {title && (
        <StripeReveal
          as="h1"
          className="md:text-hero-desktop text-hero-mobile font-switzer text-black-1 max-w-237.5 font-medium tracking-[-2%]"
        >
          {title}
        </StripeReveal>
      )}
      {subtitle && (
        <Reveal
          as="p"
          className="text-black-3 font-switzer max-w-237.5 text-sm tracking-[-2%] md:text-xl"
          byLine
        >
          {subtitle}
        </Reveal>
      )}
    </>
  );
};

export default Heading;
