import { PFHeading } from "@/app/work/page-flooring/_components/platform/Outcome";
import { MultiplePlatformIcon, ReconcileIcon, FeatureIcon, KeyIcon } from "@/components/icons";
import Section from "@/components/layout/sections/Section";

const RESULTS = [
  {
    icon: <MultiplePlatformIcon className="size-15.5 md:size-26" />,
    description: "Multiple paid platforms consolidated into one owned system.",
  },
  {
    icon: <ReconcileIcon className="size-15.5 md:size-26" />,
    description: "Manual reconciliation between project tracking and accounting eliminated.",
  },
  {
    icon: <FeatureIcon className="size-15.5 md:size-26" />,
    description: "Features the previous vendor declined to build are now live.",
  },
  {
    icon: <KeyIcon className="size-15.5 md:size-26" />,
    description:
      "The business owns its software and its data, which changes what the company is worth to an acquirer.ƒ",
  },
];
const Result: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-8 gap-4"
    >
      <PFHeading
        caption="results"
        title="One platform, built around the way the work actually moves."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {RESULTS.map((r, i) => (
          <div
            key={`${r.description}-${i}`}
            className="flex h-60 flex-col justify-between bg-white px-7 pt-10 pb-7 md:h-100"
          >
            {r.icon}
            <span className="font-switzer text-black-3 text-sm tracking-[-2%]">
              {r.description}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Result;
