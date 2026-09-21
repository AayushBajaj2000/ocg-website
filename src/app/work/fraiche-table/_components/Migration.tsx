import Heading from "@/app/work/fraiche-table/_components/Heading";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import PageDivider from "@/components/ui/dividers/PageDivider";
import { cn } from "@/lib/utils";
import Image from "next/image";

const MIGRATION_STEPS = [
  {
    title: "A technology strategy, for the first time",
    description:
      "A written plan: what to build, in what order, on what foundation, and why. Every decision since has been made against it.",
  },
  {
    title: "Ship in weeks, not quarters",
    description:
      "Features that were quoted in months now move in weeks. The gap between an idea and a live product is mostly gone.",
  },
  {
    title: "Features that weren't possible before",
    description:
      "Dynamic grocery lists, automatic nutrition, ingredient swaps that don't break anything downstream.",
  },
];

const PROBLEM_TEXTS = [
  "Fraîche Table was built on a blogging platform. That was the right call on day one, because it put a real product in front of real customers fast. But a meal-planning platform is not a blog, and over the years the team made a publishing tool do things it was never designed to do.",
  "It held for a long time. Then the audience grew, the roadmap grew, and the cracks showed up in the product they needed to build next.",
  "Underneath it, every recipe was plain text. The system had no concept of an ingredient; it was a line someone typed. That is why grocery lists were assembled by hand, prep steps were re-entered every week, nutrition couldn't be calculated, and every new feature started from zero.",
  "They had already tried to solve it. They went to market, got quoted long timelines and large numbers, and started the rebuild with another firm. Nearly a year later they were still on the same website, and the work was written off.",
  "The deeper problem was not the vendor. What Fraîche Table didn't have was a technology strategy: someone whose job was to decide how things get built and in what order.",
];

const PROCESS_TEXT = [
  "Most of this industry runs on yes. A client describes a solution, the agency quotes it and builds it, and nobody asks what the solution was supposed to fix. This is how you spend a year and end up where you started.",
  "Fraîche Table came to us with a solution: move off the old platform. We asked why. The answer was not that the old platform was bad. It was that they couldn't ship and couldn't see the finish line. Those two problems need different builds.",
];

const PROCESS_STEPS = [
  {
    title: "Set the strategy before the sprint",
    description:
      "We started with the problem rather than the stack. What do you want to ship in the next two years, what stops you today, and what has to be true of the foundation for all of it to be possible?",
  },
  {
    title: "Design the data before the screens.",
    description:
      "This was less a migration than a re-modelling of how Fraîche Table's content works, and that decision is why everything after it was fast.",
  },
  {
    title: "Move into their environment.",
    description:
      "We joined their team's channels and worked in them all day rather than on a weekly status call. Questions got answered in minutes instead of sprints.",
  },
  {
    title: "Build, show, adjust, repeat.",
    description:
      "A tight feedback loop with a brand-led client. Develop, put it in front of them, take the note, adjust. Nobody waited six weeks for a reveal.",
  },
];

const Migration: React.FC = () => {
  return (
    <>
      <Section
        as="div"
        container
        containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-7 gap-4"
      >
        <div>
          <span className="font-switzer bg-numeral-2 text-brand-blue mb-2 px-2 py-1 text-xs font-medium tracking-[-2%] uppercase sm:text-sm">
            The migration
          </span>
        </div>
        <Heading
          title="Rebuild the foundation. Ship the vision faster."
          subtitle="We rebuilt Fraîche Table's foundation from the data up. Features that took a year now take weeks, the admin work behind every recipe fell away, and things that were impossible on the old platform are now standard."
        />
        <div className="grid grid-cols-1 md:grid-cols-3">
          {MIGRATION_STEPS.map((m, i) => (
            <div key={`${m.title}-${i}`} className="flex flex-col gap-4 bg-white p-4 md:p-5.5">
              <p className="text-black-1 font-switzer text-sm font-medium tracking-[-2%] md:text-base">
                {m.title}
              </p>
              <span className="font-switzer text-black-3 text-xs tracking-[-2%] md:text-sm">
                {m.description}
              </span>
            </div>
          ))}
        </div>
      </Section>
      <PageDivider />
      <Section
        as="div"
        container
        containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-7 gap-4"
      >
        <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
          Problem
        </span>
        <StripeReveal
          as="h2"
          className="md:text-hero-mobile font-switzer text-black-1 text-2xl font-medium tracking-[-2%]"
        >
          The platform was working. It just wasn&apos;t going to keep working.
        </StripeReveal>
        <div className="flex flex-col gap-2">
          {PROBLEM_TEXTS.map((t, i) => (
            <Reveal
              key={`${t}-${i}`}
              as="p"
              className="font-switzer text-black-3 text-sm tracking-[-2%] md:text-base"
              byLine
            >
              {t}
            </Reveal>
          ))}
        </div>
      </Section>
      <PageDivider />
      <Section as="div" container containerClassName="md:py-16 py-10 border-x">
        <Image
          src="/fraiche-table/work/migration-feedback.webp"
          alt="migration feedback"
          width={1040}
          height={315}
          className="hidden object-cover sm:block"
        />
        <Image
          src="/fraiche-table/work/migration-feedback-mob.webp"
          alt="migration feedback"
          width={343}
          height={257}
          className="object-cover sm:hidden"
        />
      </Section>
      <PageDivider />
      <Section
        as="div"
        container
        containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-7 gap-4"
      >
        <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
          Process
        </span>
        <StripeReveal
          as="h2"
          className="md:text-hero-mobile font-switzer text-black-1 text-2xl font-medium tracking-[-2%]"
        >
          Understand the problem before you quote the solution
        </StripeReveal>
        <div className="flex flex-col gap-2">
          {PROCESS_TEXT.map((t, i) => (
            <Reveal
              key={`${t}-${i}`}
              as="p"
              className="font-switzer text-black-3 text-sm tracking-[-2%] md:text-base"
              byLine
            >
              {t}
            </Reveal>
          ))}
        </div>
        <div className="bg-white">
          {PROCESS_STEPS.map((s, i) => (
            <div
              key={`${s.title}-${i}`}
              className={cn("flex flex-col gap-1 p-5 md:p-6", {
                "border-b border-neutral-200": i + 1 < PROCESS_STEPS.length,
              })}
            >
              <span className="font-switzer text-brand-blue text-xs tracking-[-2%]">0{i + 1}</span>
              <h4 className="font-switzer text-black-1 text-base font-medium tracking-[-2%]">
                {s.title}
              </h4>
              <p className="font-switzer text-black-3 text-sm tracking-[-2%]">{s.description}</p>
            </div>
          ))}
        </div>
      </Section>
      <PageDivider />
      <Section
        as="div"
        container
        containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-7 gap-4"
      >
        <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
          Solution
        </span>
        <StripeReveal
          as="h2"
          className="md:text-hero-mobile font-switzer text-black-1 text-2xl font-medium tracking-[-2%]"
        >
          We gave the content a structure, and the structure gave them a product.
        </StripeReveal>
        <Reveal
          as="p"
          className="font-switzer text-black-3 text-sm tracking-[-2%] md:text-base"
          byLine
        >
          The old setup stored a recipe as a page of text. We moved Fraîche Table onto a structured
          content system where an ingredient is a reusable object with a name, a unit, nutritional
          data and a list of every recipe that uses it. That one change did most of the work.
        </Reveal>
        <div>
          <Image
            src="/fraiche-table/work/before-after.webp"
            alt="before after"
            width={1054}
            height={472}
            className="hidden object-cover sm:block"
          />
          <Image
            src="/fraiche-table/work/before-after-mob.webp"
            alt="before after"
            width={1054}
            height={472}
            className="object-cover sm:hidden"
          />
        </div>
        <Reveal as="span" className="font-switzer text-black-3 text-sm tracking-[-2%]">
          One change to the model. Everything downstream follows from it.
        </Reveal>
        <Reveal as="p" className="font-switzer text-black-1 text-base font-medium tracking-[-2%]">
          Once the platform understands ingredients rather than displaying them:
        </Reveal>
        <ul className="marker:text-brand-blue flex list-disc flex-col gap-3 pl-4">
          <Reveal as="li" className="font-switzer text-black-3 text-base tracking-[-2%]">
            Grocery lists build themselves for any combination of meals, any week, any household
            size.
          </Reveal>
          <Reveal as="li" className="font-switzer text-black-3 text-base tracking-[-2%]">
            Pluralization, quantities and prep steps resolve automatically. No more &quot;(s)&quot;
            in brackets and no hand-written prep each week.
          </Reveal>
          <Reveal as="li" className="font-switzer text-black-3 text-base tracking-[-2%]">
            Swap an ingredient and nothing downstream breaks. The grocery list, the nutrition and
            the prep all follow.
          </Reveal>
        </ul>
        <Reveal as="p" className="font-switzer text-black-3 text-base tracking-[-2%]">
          We also moved the front end off the blogging platform onto a modern application framework
          and put a dedicated content system behind it. The team edits content in a tool designed
          for it, and nobody on their side has to think about the structure underneath.
        </Reveal>
      </Section>
    </>
  );
};

export default Migration;
