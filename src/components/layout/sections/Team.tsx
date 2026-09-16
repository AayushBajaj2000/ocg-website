import Image from "next/image";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import TeamCarousel from "@/components/ui/carousels/TeamCarousel";
import { TeamCardWrapper } from "@/components/ui/cards/TeamCard";
import { TEAM_SECTION } from "@/lib/constants";

const Team: React.FC = () => {
  return (
    <Section container containerClassName="md:py-20 py-10 border-x xl:px-0! 2xl:px-16!">
      <div className="flex flex-col gap-8 md:gap-16">
        <div className="flex flex-col gap-4 text-center">
          <StripeReveal
            as="h2"
            className="text-black-1 font-switzer md:text-hero-desktop text-hero-mobile font-medium"
          >
            {TEAM_SECTION.title}
          </StripeReveal>
          <Reveal
            as="p"
            byLine
            className="font-switzer text-black-2 mx-auto max-w-lg text-sm tracking-[-2%] md:text-base"
          >
            {TEAM_SECTION.description}
          </Reveal>
        </div>
        <div className="flex gap-4">
          <TeamCardWrapper className="hidden w-[40%] p-10 lg:flex xl:border-l-0 2xl:border-l">
            <Reveal>
              <Image
                src={TEAM_SECTION.badge?.url!}
                alt={TEAM_SECTION.badge?.alt!}
                width={187}
                height={129}
                className="object-cover"
                style={{
                  height: "auto",
                  width: "auto",
                }}
              />
            </Reveal>
            <div className="flex flex-col gap-4">
              <Reveal
                as="span"
                className="font-switzer text-xl tracking-[-2%] text-black/70"
                byLine
              >
                {TEAM_SECTION.lineOne}
              </Reveal>
              <Reveal
                as="span"
                className="font-switzer text-xl tracking-[-2%] text-black/70"
                byLine
              >
                {TEAM_SECTION.lineTwo}
              </Reveal>
            </div>
          </TeamCardWrapper>
          <TeamCardWrapper className="flex-1 xl:border-r-0 2xl:border-r">
            <TeamCarousel team={TEAM_SECTION.team ?? []} className="flex-1" />
            <div className="flex flex-col gap-8 px-4 pb-10 lg:hidden">
              <div className="flex flex-col gap-4">
                <Reveal as="span" className="font-switzer text-sm text-black/70 md:text-xl" byLine>
                  {TEAM_SECTION.lineOne}
                </Reveal>
                <Reveal as="span" className="font-switzer text-sm text-black/70 md:text-xl" byLine>
                  {TEAM_SECTION.lineTwo}
                </Reveal>
              </div>
              <Reveal>
                <Image
                  src={TEAM_SECTION.badge?.url!}
                  alt={TEAM_SECTION.badge?.alt!}
                  width={120}
                  height={80}
                  className="object-cover"
                  style={{
                    height: "auto",
                    width: "auto",
                  }}
                />
              </Reveal>
            </div>
          </TeamCardWrapper>
        </div>
      </div>
    </Section>
  );
};

export default Team;
