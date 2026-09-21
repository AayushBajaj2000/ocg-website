import AOHeading from "@/app/work/anesthesia-one/_components/Heading";
import Testimonial from "@/app/work/anesthesia-one/_components/Testimonial";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import Image from "next/image";

const PROBLEM_CARDS: { image: { src: string; alt: string }; paragraphs: string[] }[] = [
  {
    image: { src: "/anesthesia-one/app/problem-1.webp", alt: "Calculator and lab tool icons" },
    paragraphs: [
      "Dr. Sanjib Adhikary had a clear vision: put the reference and calculation tools anesthesia professionals need in their pocket.",
    ],
  },
  {
    image: {
      src: "/anesthesia-one/app/problem-2.webp",
      alt: "AnesthesiaOne app with a verified badge",
    },
    paragraphs: [
      "The challenge was everything around it. Clinical calculations needed careful verification.",
      "Guidance had to be quick to find and the product needed to remain useful in a hospital with an unreliable connection.",
    ],
  },
  {
    image: {
      src: "/anesthesia-one/app/problem-3.webp",
      alt: "The previous AnesthesiaOne web platform",
    },
    paragraphs: [
      "At the same time, an aging web platform needed a new foundation—and a partner willing to understand the clinical workflow before building.",
    ],
  },
];

const Problem: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-10 gap-4"
    >
      <AOHeading caption="Problem" title="Clinical software has to be right every time." />
      <div className="flex flex-col gap-4 md:gap-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {PROBLEM_CARDS.map((c) => (
            <div
              key={c.image.src}
              className="flex flex-col gap-6 rounded-3xl bg-neutral-50 p-4 lg:h-123"
            >
              <Image
                src={c.image.src}
                alt={c.image.alt}
                width={656}
                height={500}
                sizes="(min-width: 1024px) 328px, 100vw"
                className="w-full rounded-2xl"
              />
              <div className="flex flex-col gap-4">
                {c.paragraphs.map((p) => (
                  <Reveal
                    key={p}
                    as="p"
                    className="font-switzer text-sm text-neutral-700 md:text-base"
                    byLine
                  >
                    {p}
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Testimonial
          quote="“ A talented, motivated, professional team and has simply been a pleasure to work with”"
          name="Dr. Sanjib Adhikary"
          role="AnesthesiaOne"
        />
      </div>
    </Section>
  );
};

export default Problem;
