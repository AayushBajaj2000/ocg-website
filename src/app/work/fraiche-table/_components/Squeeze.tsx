import Image from "next/image";
import Section from "@/components/layout/sections/Section";
import PageDivider from "@/components/ui/dividers/PageDivider";
import FillHeading from "@/components/ui/headings/FillHeading";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { Reveal } from "@/components/ui/animations/Reveal";

const PROBLEM_HEADING: string =
  "A big recipe library is an asset until someone has to pick from it. Fraîche Table's members had plenty of options and no easy way to decide.";

const Squeeze: React.FC = () => {
  return (
    <>
      <Section as="div" container containerClassName="md:py-16 py-10 border-x">
        <Image
          src="/fraiche-table/work/squeeze/hero.webp"
          alt="hero image"
          width={1081}
          height={469}
          className="hidden object-cover sm:block"
        />
        <Image
          src="/fraiche-table/work/squeeze/hero-mob.webp"
          alt="hero image"
          width={343}
          height={521}
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
          Problem
        </span>
        <FillHeading text={PROBLEM_HEADING} className="md:text-h3! mx-auto font-medium" />
        <Image
          src="/fraiche-table/work/squeeze/problem-img.webp"
          alt="problem image"
          width={1081}
          height={469}
          className="hidden object-cover sm:block"
        />
        <Image
          src="/fraiche-table/work/squeeze/problem-img-mob.webp"
          alt="problem image"
          width={296}
          height={307}
          className="w-full object-cover sm:hidden"
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
          Squeeze started as a conversation. The team knew the frustration; the question was what
          the smallest thing that fixes it looks like.
        </StripeReveal>
        <Reveal
          as="p"
          className="font-switzer text-black-3 tracing-[-2%] text-sm md:text-base"
          byLine
        >
          We scoped it in to one interaction – see a meal and keep it or lose it and built it on the
          structured library from the migration. No new content, no new data model. The foundation
          was already there.
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Image
            src="/fraiche-table/work/squeeze/process-img-1.webp"
            alt="process-img-1"
            width={350}
            height={469}
            className="object-cover"
          />
          <Image
            src="/fraiche-table/work/squeeze/process-img-2.webp"
            alt="process-img-2"
            width={350}
            height={469}
            className="object-cover"
          />
          <Image
            src="/fraiche-table/work/squeeze/process-img-3.webp"
            alt="process-img-3"
            width={350}
            height={469}
            className="object-cover"
          />
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
          A swipe-based discovery surface built on top of the existing recipe library. Every keep
          flows straight into the meal plan, and from there into the grocery list, so a two-second
          decision becomes a planned week without anyone opening a planner.
        </StripeReveal>
        <ul className="marker:text-brand-blue flex list-disc flex-col gap-3 pl-4">
          <Reveal as="li" className="font-switzer text-black-3 text-base tracking-[-2%]">
            Built on the existing structured library, with no duplicate content
          </Reveal>
          <Reveal as="li" className="font-switzer text-black-3 text-base tracking-[-2%]">
            Every keep feeds the meal plan and grocery list downstream
          </Reveal>
          <Reveal as="li" className="font-switzer text-black-3 text-base tracking-[-2%]">
            Shipped in weeks, on the foundation the migration created.
          </Reveal>
        </ul>
      </Section>
    </>
  );
};

export default Squeeze;
