import Image from "next/image";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import TeamCard, { TeamCardWrapper } from "@/components/ui/cards/TeamCard";

const Team: React.FC = () => {
  return (
    <Section container containerClassName="md:py-20 py-10">
      <div className="flex flex-col gap-8 md:gap-16">
        <div className="flex flex-col gap-4 text-center">
          <StripeReveal
            as="h2"
            className="text-black-1 font-switzer md:text-hero-desktop text-hero-mobile font-medium"
          >
            Meet the team
          </StripeReveal>
          <Reveal
            as="p"
            byLine
            className="font-switzer text-black-2 mx-auto max-w-lg text-sm tracking-[-2%] md:text-base"
          >
            Our team members are the heartbeat of our company. Get to know a team and culture that
            prioritizes work ethic, collaboration, and kindness!
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:gap-8 xl:grid-cols-2">
          <TeamCardWrapper>
            <Reveal>
              <Image
                src="/graphics/ontario-badge.webp"
                alt="ontario badge"
                width={187}
                height={129}
                className="w-20 object-cover md:w-46.75"
              />
            </Reveal>
            <div className="flex flex-col gap-4 md:gap-10">
              <Reveal as="span" className="font-switzer text-sm text-black/70 md:text-2xl" byLine>
                OpenCore was intentionally built differently. No unnecessary layers. No handing
                projects from one department to another.
              </Reveal>
              <Reveal as="span" className="font-switzer text-sm text-black/70 md:text-2xl" byLine>
                You work directly with the people designing, building, and shaping your product from
                day one.
              </Reveal>
            </div>
          </TeamCardWrapper>
          <TeamCardWrapper className="items-center justify-center p-0!">
            <TeamCard />
          </TeamCardWrapper>
        </div>
      </div>
    </Section>
  );
};

export default Team;
