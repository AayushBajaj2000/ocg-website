import Section from "@/components/layout/sections/Section";
import StatCard from "@/components/ui/cards/StatCard";
import TrustedByCard from "@/components/ui/cards/TrustedByCard";
import { TRUSTED_BY_SECTION } from "@/lib/constants";

const TrustedBy: React.FC = () => {
  return (
    <Section
      as="section"
      container
      aria-labelledby="trusted-by-title"
      containerClassName="border-x-hairline border-x xl:px-0! md:px-0! px-0! overflow-visible!"
    >
      <div className="flex flex-col items-center gap-4 py-6 md:gap-12.5 md:py-10">
        <h2
          id="trusted-by-title"
          className="font-switzer text-xs tracking-[-2%] text-neutral-500 uppercase md:text-xl"
        >
          {TRUSTED_BY_SECTION.title}
        </h2>
        <ul className="border-hairline grid w-full grid-cols-2 border-t *:shadow-[1px_0_0_0_var(--color-hairline),0_1px_0_0_var(--color-hairline),1px_1px_0_0_var(--color-hairline)] md:grid-cols-3 lg:grid-cols-6">
          {TRUSTED_BY_SECTION.items.map((item) =>
            item._type === "cta" ? (
              <TrustedByCard key={item._key} cta={item} />
            ) : (
              <TrustedByCard key={item._key} client={item} />
            ),
          )}
        </ul>
      </div>
      <ul className="grid grid-cols-1 gap-5 py-6 md:grid-cols-2 md:py-10 lg:grid-cols-3 xl:grid-cols-4">
        {TRUSTED_BY_SECTION.stats.map((stat, index) => (
          <StatCard key={stat._key} stat={stat} index={index} />
        ))}
      </ul>
    </Section>
  );
};

export default TrustedBy;
