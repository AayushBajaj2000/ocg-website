import Section from "@/components/layout/sections/Section";
import StatCard from "@/components/ui/cards/StatCard";
import TrustedByCards from "@/components/ui/cards/TrustedByCards";
import { TRUSTED_BY_SECTION } from "@/lib/constants";
import { fetchTrustedByItems } from "@/lib/trustedBy/server";
import { cn } from "@/lib/utils";

type Props = {
  hasHeading?: boolean;
  hasStats?: boolean;
};

const TrustedBy = async ({ hasHeading = true, hasStats = true }: Props) => {
  const items = await fetchTrustedByItems();

  return (
    <Section
      as="section"
      container
      aria-labelledby="trusted-by-title"
      containerClassName="border-x-hairline border-x xl:px-0! md:px-0! px-0! overflow-visible!"
    >
      <div
        className={cn("flex flex-col items-center", {
          "gap-4 py-6 md:gap-12.5 md:py-10": hasHeading,
        })}
      >
        {hasHeading && (
          <h2
            id="trusted-by-title"
            className="font-switzer text-xs tracking-[-2%] text-neutral-500 uppercase md:text-xl"
          >
            {TRUSTED_BY_SECTION.title}
          </h2>
        )}
        <TrustedByCards items={items} />
      </div>
      {hasStats && (
        <ul className="grid grid-cols-1 gap-5 py-6 md:grid-cols-2 md:py-10 lg:grid-cols-3 xl:grid-cols-4">
          {TRUSTED_BY_SECTION.stats.map((stat, index) => (
            <StatCard key={stat._key} stat={stat} index={index} />
          ))}
        </ul>
      )}
    </Section>
  );
};

export default TrustedBy;
