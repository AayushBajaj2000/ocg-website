import { PFHeading } from "@/app/work/page-flooring/_components/platform/Outcome";
import Section from "@/components/layout/sections/Section";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import Image from "next/image";

const PROCESS_DATA = [
  {
    title: "On site, with their people",
    description:
      "Our team sat with theirs across estimating, project management, accounting and the field, and with leadership. Different people, different truths.",
    factors: ["Estimating", "Project management", "Accounting", "Field", "Leadership"],
  },
  {
    title: "Map what happens today.",
    description:
      "Including every manual workaround built over the years to patch a gap. Those workarounds are documentation: each one marks where the old system failed.",
  },
  {
    title: "Understand the history.",
    description:
      "How they’ve always done it, and how they do it today. Those are rarely the same thing, and the difference tells you what’s essential and what’s leftover.",
  },
  {
    title: "Build in their channel.",
    description:
      "Shared chat, continuous feedback, functionality in front of them while it’s still cheap to change.",
  },
];

const Process: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-8 gap-4"
    >
      <PFHeading
        caption="Process"
        title="You can't design a better process until you understand the one they have."
        description="The work started in their building."
      />
      <div>
        {PROCESS_DATA.map((p, i) => (
          <div
            key={`${p.title}-${i}`}
            className="border-hairline flex flex-col gap-2 border-t py-4 last:border-b md:flex-row md:gap-5 md:py-7"
          >
            <span className="text-brand-blue font-switzer text-xs tracking-[-2%] md:w-19">
              0{i + 1}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-switzer text-black-1 text-lg font-medium tracking-[-2%] md:text-xl">
                {p.title}
              </h3>
              <p className="text-black-3 font-switzer text-sm tracking-[-2%] md:text-base">
                {p.description}
              </p>
              {p.factors && p.factors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.factors.map((f, i) => (
                    <span
                      key={`${f}-${i}`}
                      className="text-black-3 font-jetbrains-mono border-hairline border px-2.25 py-1.25 text-[0.625rem] uppercase"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <PFHeading caption="Process map" />
          <span className="font-switzer text-black-3 text-sm tracking-[-2%]">
            5 DEPARTMENTS · 1 JOB, START TO FINISH
          </span>
        </div>
        <div>
          <Image
            src="/page-flooring/platform/process.webp"
            alt="process img"
            width={1428}
            height={390}
            className="hidden object-cover sm:block"
          />
          <Image
            src="/page-flooring/platform/process-mob.webp"
            alt="process img"
            width={309}
            height={312}
            className="object-cover sm:hidden"
          />
        </div>
        <span className="font-switzer text-black-3 text-xs tracking-[-2%] md:text-sm">
          Drawn from the on-site sessions. The orange bars are the inventory of workarounds — and
          the build order came straight off them.
        </span>
      </div>
      <StripeReveal
        as="h3"
        className="md:text-footer-desktop text-black-1 border-t-black-1 border-t pt-4 text-2xl font-medium md:mt-4 md:pt-8 lg:mt-8"
      >
        You cannot build an improved process if you don&apos;t understand the current one. Most
        software projects fail right here, before a line of code is written.
      </StripeReveal>
    </Section>
  );
};

export default Process;
