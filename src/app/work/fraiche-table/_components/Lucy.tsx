import Image from "next/image";
import { AnchorIcon, BetaBadgeIcon, TasksIcon } from "@/components/icons";
import Heading from "@/app/work/fraiche-table/_components/Heading";
import Section from "@/components/layout/sections/Section";
import WordSection from "@/components/layout/sections/WordSection";
import PageDivider from "@/components/ui/dividers/PageDivider";
import type { IWordSection } from "@/types";
import FillHeading from "@/components/ui/headings/FillHeading";
import { Reveal } from "@/components/ui/animations/Reveal";
import { cn } from "@/lib/utils";

const LUCY_WORD_SECTION: IWordSection = {
  heading:
    "Every brand told to add AI. Most of what ships os a chat box that makes things up, gets an allergy wrong, and damages trust the brand spent years building. For a platform built on one person's name and her members' dietary decisions, that is the risk that matters.",
  description:
    "The opportunity was completion rather than conversation. Members don't want to chat about food. They want the three or four things they already do in the app to take five seconds instead of five minutes.",
};

const PROCESS_HEADING: string =
  "Built under a rule the client set and we agreed with immediately: nothing launches until everyone on that call is confident. Delay is acceptable. Being wrong is not.";

const RESULTS = [
  {
    icon: <BetaBadgeIcon />,
    description: "Shipped to members behind a beta badge, with disclosure and a feedback path",
  },
  {
    icon: <AnchorIcon />,
    description: "Anchors the premium tier alongside personalized onboarding",
  },
  {
    icon: <TasksIcon />,
    description: "Success measured in completed tasks rather than message volume",
  },
];

const RESULT_BORDER_CLASS = [
  "border-b md:border-r md:border-b-0",
  "border-b md:border-r md:border-b-0",
  "",
];

const Lucy: React.FC = () => {
  return (
    <>
      <Section
        as="div"
        container
        containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-7 gap-4"
      >
        <div>
          <span className="font-switzer bg-numeral-2 text-brand-blue mb-2 px-2 py-1 text-xs font-medium tracking-[-2%] uppercase sm:text-sm">
            Lucy kitchen assistant
          </span>
        </div>
        <Heading
          title="An AI that knows the menu."
          subtitle="We built Fraîche Table an in-product assistant that plans your week, picks your dinner and swaps a meal you don't like. Every answer comes from their real recipe library."
        />
        <Image
          src="/fraiche-table/work/lucy/hero.webp"
          alt="hero img"
          width={1084}
          height={642}
          className="hidden object-cover sm:block"
        />
        <Image
          src="/fraiche-table/work/lucy/hero-mob.webp"
          alt="hero img mobile"
          width={311}
          height={540}
          className="w-full object-cover sm:hidden"
        />
      </Section>
      <PageDivider />
      <Section
        as="div"
        container
        containerClassName="md:py-16 py-10 border-x flex flex-col gap-4 md:gap-7"
      >
        <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
          Problem
        </span>
        <WordSection
          as="div"
          {...LUCY_WORD_SECTION}
          containerClassName="xl:px-0! md:px-0! px-0!"
          innerClassName="max-w-full!"
        />
        <Image
          src="/fraiche-table/work/lucy/feedback.webp"
          alt="feedback"
          width={1040}
          height={246}
          className="hidden object-cover sm:block"
        />
        <Image
          src="/fraiche-table/work/lucy/feedback-mob.webp"
          alt="feedback mobile"
          width={343}
          height={186}
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
        <FillHeading text={PROCESS_HEADING} className="md:text-hero-mobile! mx-auto font-medium" />
        <Image
          src="/fraiche-table/work/lucy/process.webp"
          alt="process image"
          width={1081}
          height={469}
          className="hidden object-cover sm:block"
        />
        <Image
          src="/fraiche-table/work/lucy/process-mob.webp"
          alt="process image"
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
          Solution
        </span>
        <Reveal
          as="p"
          className="text-black-3 font-switzer max-w-237.5 text-sm tracking-[-2%] md:text-xl"
          byLine
        >
          Lucy is a retrieval-grounded assistant with three tools: search the recipe library, open a
          recipe, and search platform help. It cannot answer a dietary or ingredient question
          without first loading the recipe, and anything touching an account, a refund or a login is
          handed to a human.
        </Reveal>
        <div className="flex flex-col gap-5">
          <div>
            <Image
              src="/fraiche-table/work/lucy/solution-1.webp"
              alt="solution-img-1"
              width={1084}
              height={642}
              className="hidden object-cover sm:block"
            />
            <Image
              src="/fraiche-table/work/lucy/solution-1-mob.webp"
              alt="solution-img-1"
              width={311}
              height={540}
              className="w-full object-cover sm:hidden"
            />
          </div>
          <div>
            <Image
              src="/fraiche-table/work/lucy/solution-2.webp"
              alt="solution-img-2"
              width={1084}
              height={642}
              className="hidden object-cover sm:block"
            />
            <Image
              src="/fraiche-table/work/lucy/solution-2-mob.webp"
              alt="solution-img-2"
              width={311}
              height={540}
              className="w-full object-cover sm:hidden"
            />
          </div>
          <div>
            <Image
              src="/fraiche-table/work/lucy/solution-3.webp"
              alt="solution-img-3"
              width={1084}
              height={642}
              className="hidden object-cover sm:block"
            />
            <Image
              src="/fraiche-table/work/lucy/solution-3-mob.webp"
              alt="solution-img-3"
              width={311}
              height={540}
              className="w-full object-cover sm:hidden"
            />
          </div>
          <div>
            <Image
              src="/fraiche-table/work/lucy/solution-4.webp"
              alt="solution-img-4"
              width={1084}
              height={642}
              className="hidden object-cover sm:block"
            />
            <Image
              src="/fraiche-table/work/lucy/solution-4-mob.webp"
              alt="solution-img-4"
              width={311}
              height={540}
              className="w-full object-cover sm:hidden"
            />
          </div>
          <div>
            <Image
              src="/fraiche-table/work/lucy/solution-5.webp"
              alt="solution-img-5"
              width={1084}
              height={642}
              className="hidden object-cover sm:block"
            />
            <Image
              src="/fraiche-table/work/lucy/solution-5-mob.webp"
              alt="solution-img-5"
              width={311}
              height={540}
              className="w-full object-cover sm:hidden"
            />
          </div>
        </div>
      </Section>
      <PageDivider />
      <Section
        as="div"
        container
        containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-7 gap-4"
      >
        <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
          Result
        </span>
        <div className="grid grid-cols-1 border border-neutral-300 md:grid-cols-3">
          {RESULTS.map((r, i) => (
            <div
              key={`${r.description}-${i}`}
              className={cn(
                "flex h-71 flex-col justify-between border-neutral-300 p-7",
                RESULT_BORDER_CLASS[i],
              )}
            >
              <div className="grid size-14 place-content-center border border-neutral-300">
                {r.icon}
              </div>
              <span className="font-switzer text-black-3 text-sm tracking-[-2%]">
                {r.description}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};

export default Lucy;
