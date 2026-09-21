import { BoltIcon, FoundationIcon, StepsIcon, WorkflowIcon } from "@/components/icons";
import Section from "@/components/layout/sections/Section";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { cn } from "@/lib/utils";

const RESULTS = [
  { icon: <BoltIcon />, description: "Time from idea to shipped feature down 60-70%" },
  {
    icon: <WorkflowIcon />,
    description: "Recipe publishing went from manual data entry to a structured workflow",
  },
  {
    icon: <StepsIcon />,
    description:
      "Fewer support tickets about wrong grocery lists, because lists are generated rather than typed.",
  },
  {
    icon: <FoundationIcon />,
    description: "A foundation that has since carried two more products without being rebuilt.",
  },
];

const RESULT_BORDER_CLASS = [
  "border-b md:border-r lg:border-b-0",
  "border-b lg:border-r lg:border-b-0",
  "border-b md:border-r md:border-b-0",
  "",
];

const Results: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col gap-2"
    >
      <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
        Results
      </span>
      <StripeReveal
        as="h3"
        className="md:text-h3 font-switzer text-black-1 mb-5 text-2xl font-medium"
      >
        What the new foundation paid for.
      </StripeReveal>
      <div className="grid grid-cols-1 border border-neutral-300 md:grid-cols-2 lg:grid-cols-4">
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
  );
};

export default Results;
