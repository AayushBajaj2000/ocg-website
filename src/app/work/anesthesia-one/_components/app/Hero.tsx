import Heading from "@/app/work/fraiche-table/_components/Heading";
import Section from "@/components/layout/sections/Section";
import Image from "next/image";

const HERO_METRICS: { label: string; description: string[] }[] = [
  {
    label: "Engagement",
    description: ["Platform rebuild", "Product & AI", "Design System"],
  },
  {
    label: "Timeline",
    description: ["2024 — ongoing"],
  },
  {
    label: "Shipped",
    description: ["3 products in year one"],
  },
  {
    label: "Scope",
    description: ["Strategy, data model, web app, design system, AI"],
  },
];

const Hero: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col gap-8 md:gap-16"
    >
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-4 md:gap-6">
          <Image
            src="/anesthesia-one/shared/logo.webp"
            alt="AnesthesiaOne"
            width={600}
            height={90}
            className="h-auto w-40 md:w-50"
          />
          <div className="flex flex-col gap-4">
            <Heading
              title="Clinical reference software, built to the standard clinicians expect."
              titleClassName="text-neutral-700! max-w-232.75!"
              subtitle="A physician came to us with a tool anesthesia professionals needed and no way to build it. We designed and developed the mobile app, rebuilt the web platform and created the brand, and stayed on to keep it current."
              subtitleClassName="text-neutral-500! max-w-248! md:text-xl/7.5! tracking-[-1%]!"
            />
          </div>
        </div>
        <Image
          priority
          src="/anesthesia-one/app/hero.webp"
          alt="AnesthesiaOne mobile app and web platform screens"
          width={2274}
          height={1262}
          sizes="(min-width: 1536px) 1395px, 100vw"
          className="w-full rounded-xl object-cover md:rounded-[1.25rem]"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
        {HERO_METRICS.map((m) => (
          <div key={m.label} className="flex flex-col gap-2 pr-6">
            <span className="font-switzer text-xs tracking-[1%] text-neutral-400 uppercase">
              {m.label}
            </span>
            <div className="flex flex-col gap-1">
              {m.description.map((d) => (
                <p key={d} className="font-switzer text-black-1 text-sm">
                  {d}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Hero;
