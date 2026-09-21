import AOHeading from "@/app/work/anesthesia-one/_components/Heading";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";

const PROCESS_STEPS = [
  {
    title: "Translate clinical into technical.",
    description:
      "We worked directly with Dr. Adhikary to turn medical requirements into specifications, which meant asking questions until we understood the workflow behind each feature.",
  },
  {
    title: "Design for the environment.",
    description:
      "High-stakes settings, one-handed use, constant interruptions. The interface had to be fast and legible.",
  },
  {
    title: "Verify the things that must not be wrong.",
    description:
      "Calculators and clinical flows got far more review than their size on screen suggests, because that is where the risk is.",
  },
  {
    title: "Ship and keep shipping.",
    description:
      "Launch was a milestone. Maintenance, improvements and analytics review continue on retainer.",
  },
];

const Process: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-10 gap-4"
    >
      <AOHeading
        caption="Process"
        captionWeight="regular"
        title="We built the guardrails before we built the feature."
        titleClassName="font-normal! text-black!"
        description="Most AI features ship the chat first and add safety when someone complains. We did the reverse: decide what the assistant may not do, then build the smallest thing that does the job inside those limits."
      />
      <div className="flex flex-col gap-4 md:gap-6">
        {PROCESS_STEPS.map((s, i) => (
          <div
            key={s.title}
            className="flex flex-col gap-3 rounded-3xl bg-neutral-50 p-6 sm:flex-row sm:gap-12 md:p-8"
          >
            <span className="font-switzer text-anesthesia-orange text-sm">0{i + 1}</span>
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="font-switzer text-lg tracking-[-1%] text-black md:text-xl/7.5">
                {s.title}
              </h3>
              <Reveal as="p" className="font-switzer text-sm text-neutral-500 md:text-base" byLine>
                {s.description}
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Process;
