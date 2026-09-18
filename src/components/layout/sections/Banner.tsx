import Section from "@/components/layout/sections/Section";
import BannerShader from "@/components/shaders/banner-shader/BannerShader";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

const Banner: React.FC<Props> = ({ title, description, children }) => {
  return (
    <Section
      container
      containerClassName="isolate bg-center bg-cover bg-no-repeat flex h-90.5 items-end pb-16 md:h-94 md:pb-12 border-x"
    >
      <BannerShader />
      <div className="z-50 flex w-full flex-wrap items-end justify-between gap-5 lg:flex-nowrap">
        <StripeReveal
          as="h1"
          className="md:text-hero-desktop text-hero-mobile text-black-1 max-w-77.25 font-medium tracking-[-4%] md:max-w-125"
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
            className="text-black-3 max-w-77.25 text-sm tracking-[-2%] md:text-base lg:max-w-103.25"
            delay={0.15}
            distance="1.5rem"
            byLine
          >
            {description}
          </Reveal>
          {children}
        </div>
      </div>
    </Section>
  );
};

export default Banner;
