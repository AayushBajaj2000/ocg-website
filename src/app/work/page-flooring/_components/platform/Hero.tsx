import Heading from "@/app/work/fraiche-table/_components/Heading";
import Section from "@/components/layout/sections/Section";
import Image from "next/image";

const HERO_METRICS: { label: string; description?: string }[] = [
  {
    label: "Client",
    description: "Page Flooring & Concrete Solutions",
  },
  {
    label: "Sector",
    description: "Commercial flooring & concrete",
  },
  {
    label: "Base",
    description: "813 Brock Rd, Pickering, ON",
  },
  {
    label: "Engagement",
    description: "Platform • Brand system • Website",
  },
];

const Hero: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col gap-4"
    >
      <span className="font-switzer text-xs font-medium tracking-[-2%] text-black uppercase sm:text-sm">
        Page flooring & concrete solutions
      </span>
      <Heading
        title="Five systems, three logins, and a dozen workarounds, replaced with one platform they own."
        titleClassName="max-w-full!"
        subtitle="Page Flooring was paying prices for software that didn't do what their business does. We consolidated the whole stack into one piece of software built around their workflow – then gave the company a face that matched what it had become."
      />
      <Image
        priority
        src="/page-flooring/platform/hero.webp"
        alt="page flooring hero image"
        width={1920}
        height={1080}
        className="object-cover"
      />
      <div className="border-hairline grid grid-cols-2 gap-x-4 gap-y-6 border-t pt-6 md:grid-cols-4">
        {HERO_METRICS.map((m, i) => (
          <div key={`${m.label}-${i}`} className="flex flex-col gap-2">
            <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
              {m.label}
            </span>
            <p className="font-switzer text-black-1 text-sm tracking-[-2%]">{m.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Hero;
