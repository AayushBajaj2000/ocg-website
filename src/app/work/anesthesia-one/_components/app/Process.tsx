import AOHeading from "@/app/work/anesthesia-one/_components/Heading";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import Image from "next/image";

const PROCESS_STEPS = [
  {
    title: "Translate clinical into technical.",
    description:
      "We worked directly with Dr. Adhikary to turn medical requirements into specifications, which meant asking questions until we understood the workflow behind each feature.",
    image: {
      src: "/anesthesia-one/app/process-1.webp",
      alt: "A lidocaine guideline turned into a calculator spec",
    },
  },
  {
    title: "Design for the environment.",
    description:
      "High-stakes settings, one-handed use, constant interruptions. The interface had to be fast and legible.",
    image: {
      src: "/anesthesia-one/app/process-2.webp",
      alt: "App screen annotated with the thumb zone and 48px tap targets",
    },
  },
  {
    title: "Verify the things that must not be wrong.",
    description:
      "Calculators and clinical flows got far more review than their size on screen suggests, because that is where the risk is.",
    image: {
      src: "/anesthesia-one/app/process-3.webp",
      alt: "Verified Safer Local result with its review checklist",
    },
  },
  {
    title: "Ship and keep shipping.",
    description:
      "Launch was a milestone. Maintenance, improvements and analytics review continue on retainer.",
    image: {
      src: "/anesthesia-one/app/process-4.webp",
      alt: "Timeline from launch through rebuild, extension and ongoing work",
    },
  },
];

const Process: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-10 gap-4"
    >
      <div className="max-w-206">
        <AOHeading caption="Process" title="We learned the domain before we designed a screen." />
      </div>
      <div className="flex flex-col gap-4 md:gap-6">
        {PROCESS_STEPS.map((s, i) => (
          <div
            key={s.title}
            className="flex flex-col gap-6 rounded-3xl bg-neutral-50 p-4 sm:flex-row sm:items-stretch sm:gap-8 md:p-6"
          >
            <Image
              src={s.image.src}
              alt={s.image.alt}
              width={600}
              height={600}
              sizes="300px"
              className="w-full shrink-0 rounded-2xl sm:size-60 md:size-75"
            />
            <div className="flex flex-1 flex-col justify-between gap-6">
              <span className="font-switzer text-anesthesia-orange text-xl/7.5 tracking-[-1%]">
                0{i + 1}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-switzer text-lg tracking-[-1%] text-black md:text-xl/7.5">
                  {s.title}
                </h3>
                <Reveal
                  as="p"
                  className="font-switzer max-w-162.25 text-sm text-neutral-500 md:text-base"
                  byLine
                >
                  {s.description}
                </Reveal>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Process;
