import ResultsGrid, { type ResultItem } from "@/app/work/anesthesia-one/_components/ResultsGrid";
import Heading from "@/app/work/fraiche-table/_components/Heading";
import Section from "@/components/layout/sections/Section";
import Image from "next/image";

const HERO_STATS: ResultItem[] = [
  {
    icon: { src: "/anesthesia-one/assistant/stat-1.svg", width: 42.86, height: 28.99 },
    title: "One question instead of six searches",
    description: "Native iOS and Android apps live, from design through app store approval",
  },
  {
    icon: { src: "/anesthesia-one/assistant/stat-2.svg", width: 45, height: 62.86 },
    title: "Synthesized, not scattered",
    description:
      "Where several sources speak to the same question, it brings them into one coherent answer rather than a list of links.",
  },
  {
    icon: { src: "/anesthesia-one/assistant/stat-3.svg", width: 41, height: 73.94 },
    title: "Cited, always",
    description: "Every answer points back to the source it came from.",
  },
  {
    icon: { src: "/anesthesia-one/assistant/stat-4.svg", width: 44, height: 69.65 },
    title: "Live in the app today",
    description: "Shipped and in clinicians' hands.",
  },
];

const Hero: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col gap-8 md:gap-10.75"
    >
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-4">
          <Heading
            title="Ask the question. Get the guideline."
            titleClassName="text-neutral-700! md:text-[4rem]/[4.8rem]! font-semibold! max-w-full!"
            subtitle="Anesthesia guidance is spread across societies, protocols, drug references and institutional standards, and none of it is indexed by the question a clinician has. We built AnesthesiaOne an assistant that finds the relevant guidance across sources and gives back one clear, cited answer."
            subtitleClassName="text-neutral-500! max-w-248! md:text-xl/7.5! tracking-[-1%]!"
          />
        </div>
        <Image
          priority
          src="/anesthesia-one/assistant/hero.webp"
          alt="Download the AnesthesiaOne app to get Assistant, on the App Store and Google Play"
          width={2274}
          height={1092}
          sizes="(min-width: 1536px) 1395px, 100vw"
          className="w-full rounded-xl object-cover md:rounded-[1.25rem]"
        />
      </div>
      <ResultsGrid items={HERO_STATS} cellClassName="h-auto! md:h-auto! md:gap-25 justify-start!" />
    </Section>
  );
};

export default Hero;
