import Image from "next/image";
import Section from "@/components/layout/sections/Section";
import SectionHeading from "@/components/ui/headings/SectionHeading";
import { Reveal } from "@/components/ui/animations/Reveal";
import TeamCarousel from "@/components/ui/carousels/TeamCarousel";
import { TeamCardWrapper } from "@/components/ui/cards/TeamCard";
import { TEAM_SECTION } from "@/lib/constants";
import { fetchTeamMembers } from "@/lib/team/server";

const Team = async () => {
  const team = await fetchTeamMembers();

  return (
    <Section container containerClassName="md:py-20 py-10 border-x xl:px-0! 2xl:px-16!">
      <div className="flex flex-col gap-8 md:gap-16">
        <SectionHeading title={TEAM_SECTION.title} description={TEAM_SECTION.description} />
        <div className="flex gap-4">
          <TeamCardWrapper className="hidden w-[40%] p-10 lg:flex xl:border-l-0 2xl:border-l">
            {TEAM_SECTION.badge && (
              <Reveal>
                <Image
                  src={TEAM_SECTION.badge.url}
                  alt={TEAM_SECTION.badge.alt}
                  width={187}
                  height={129}
                  className="object-cover"
                  style={{
                    height: "auto",
                    width: "auto",
                  }}
                />
              </Reveal>
            )}
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
            <TeamCarousel team={team} className="flex-1" />
            <div className="flex flex-col gap-8 px-4 pb-10 lg:hidden">
              <div className="flex flex-col gap-4">
                <Reveal as="span" className="font-switzer text-sm text-black/70 md:text-xl" byLine>
                  {TEAM_SECTION.lineOne}
                </Reveal>
                <Reveal as="span" className="font-switzer text-sm text-black/70 md:text-xl" byLine>
                  {TEAM_SECTION.lineTwo}
                </Reveal>
              </div>
              {TEAM_SECTION.badge && (
                <Reveal>
                  <Image
                    src={TEAM_SECTION.badge.url}
                    alt={TEAM_SECTION.badge.alt}
                    width={120}
                    height={80}
                    className="object-cover"
                    style={{
                      height: "auto",
                      width: "auto",
                    }}
                  />
                </Reveal>
              )}
            </div>
          </TeamCardWrapper>
        </div>
      </div>
    </Section>
  );
};

export default Team;
