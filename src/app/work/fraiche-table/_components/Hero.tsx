import Heading from "@/app/work/fraiche-table/_components/Heading";
import Section from "@/components/layout/sections/Section";
import StatCard from "@/components/ui/cards/StatCard";
import { cn } from "@/lib/utils";
import type { IStatMetric } from "@/types";
import Image from "next/image";

const HERO_METRICS: { label: string; description?: string }[] = [
  {
    label: "Engagement",
    description: "Platform rebuild Products & AI Design System",
  },
  {
    label: "Timeline",
    description: "2024 – ongoing",
  },
  {
    label: "Shipped",
    description: "3 products in year one",
  },
  {
    label: "Scope",
    description: "Strategy, data model, web app, design system, AI",
  },
];

const HERO_STATS: IStatMetric[] = [
  {
    _type: "metric",
    _key: "shipment",
    label: "Less time from idea to shipped feature",
    value: 70,
    suffix: "%",
    accent: true,
  },
  {
    _type: "metric",
    _key: "launch",
    label: "Products launched in first year",
    value: 3,
    suffix: "",
  },
  {
    _type: "metric",
    _key: "stall",
    label: "For the kind of feature that used to stall",
    value: "6-12",
    suffix: "\u00a0Weeks",
  },
];

const STAT_VALUE_CLASS = "text-[4rem] md:text-[3.5rem]";

const STAT_BORDER_CLASS: Record<string, string> = {
  shipment: "border-y md:border-r",
  launch: "border-y md:border-l lg:border-r",
  stall: "border-y md:border-r lg:border-l lg:border-r-0",
};

const Hero: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="border-x py-10 md:py-16 flex flex-col md:gap-7 gap-4"
    >
      <div className="border-b-hairline flex flex-col gap-4 border-b pb-4 md:gap-7 md:pb-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-switzer bg-numeral-2 text-brand-blue px-2 py-1 text-xs font-medium tracking-[-2%] uppercase sm:text-sm">
            meal planning platform
          </span>
          <span className="font-switzer bg-numeral-2 text-brand-blue px-2 py-1 text-xs font-medium tracking-[-2%] uppercase sm:text-sm">
            ongoing partnership since 2024
          </span>
        </div>
        <Heading
          title="A vision that outgrew its platform. We built one that could keep up."
          subtitle="Fraîche Table had a growing audience and a meal-planning platform running on a tool that was never built for it. We rebuilt the foundation, then shipped three years of roadmap in one."
        />
        <Image
          priority
          src="/fraiche-table/img-1.webp"
          alt="fraiche table hero image"
          width={1920}
          height={1080}
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
        {HERO_METRICS.map((m, i) => (
          <div key={`${m.label}-${i}`} className="flex flex-col gap-2">
            <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
              {m.label}
            </span>
            <p
              className={cn("font-switzer text-black-1 text-sm tracking-[-2%]", {
                "max-w-30": i === 0,
              })}
            >
              {m.description}
            </p>
          </div>
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {HERO_STATS.map((stat, index) => (
          <StatCard
            key={stat._key}
            stat={stat}
            index={index}
            valueClassName={STAT_VALUE_CLASS}
            borderClassName="border!"
          />
        ))}
      </ul>
    </Section>
  );
};

export default Hero;
