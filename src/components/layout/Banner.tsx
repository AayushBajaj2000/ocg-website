import Section from "@/components/layout/Section";
import BannerShader from "@/components/shaders/banner-shader/BannerShader";
import { Reveal } from "@/components/ui/Reveal";
import { StripeReveal } from "@/components/ui/StripeReveal";

type Props = {
  title: string;
  description: string;
};

const Banner: React.FC<Props> = ({ title, description }) => {
  return (
    <Section
      container
      containerClassName="bg-center bg-cover bg-no-repeat flex h-90.5 items-end pb-16 md:h-94 md:pb-12 border-x"
    >
      <BannerShader />
      <div className="z-50 flex w-full flex-wrap items-start justify-between gap-5 lg:flex-nowrap">
        <StripeReveal
          as="h1"
          className="md:text-hero-desktop text-hero-mobile text-black-1 max-w-77.25 font-medium tracking-[-4%] md:max-w-163.25"
        >
          {title}
        </StripeReveal>
        <Reveal
          as="p"
          className="text-black-3 max-w-77.25 text-sm tracking-[-2%] md:text-base lg:max-w-103.25"
          delay={0.15}
          distance="1.5rem"
          byLine
        >
          {description}
        </Reveal>
      </div>
    </Section>
  );
};

export default Banner;
