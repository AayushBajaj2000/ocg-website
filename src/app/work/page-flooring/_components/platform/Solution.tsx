import { PFHeading } from "@/app/work/page-flooring/_components/platform/Outcome";
import Section from "@/components/layout/sections/Section";
import SolutionSlideshow from "@/app/work/page-flooring/_components/platform/SolutionSlideshow";
import Image from "next/image";

const SOLUTION_POINTS = [
  {
    title: "Schedule of Values",
    description:
      "Progress billing that matches how the industry actually contracts, with two-stage locking so figures can’t move once they’re committed, and clean export for anyone who still needs it in a spreadsheet.",
  },
  {
    title: "Financial integration",
    description:
      "The accounting system stays the source of truth for the books, and the platform talks to it directly. Invoices, POs and progress billing stop being a re-typing exercise.",
  },
  {
    title: "Sample transmittals, change orders, IFC drawings",
    description:
      "The documents this trade runs on, built into the platform rather than attached to a generic task tool.",
  },
  {
    title: "Role-based access and single sign-on",
    description:
      "The field sees what the field needs. Finance sees what finance needs. One identity, tied to the systems they already use.",
  },
];

const Solution: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-8 gap-4"
    >
      <PFHeading
        caption="Solution"
        title="One platform, built around the way the work actually moves."
        description="We took everything they were stitching together and built a single system they can scale, customize and control, with the financial layer integrated rather than reconciled."
      />
      <SolutionSlideshow />
      <div className="mt-4 md:mt-8">
        {SOLUTION_POINTS.map((p, i) => (
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
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-4 md:mt-8 md:gap-6">
        <PFHeading title="The data model in plain language. Connected records, not four exports" />
        <div>
          <Image
            src="/page-flooring/platform/solution-img-6.webp"
            alt="solution img 6"
            width={1428}
            height={500}
            className="hidden object-cover sm:block"
          />
          <Image
            src="/page-flooring/platform/solution-img-6-mob.webp"
            alt="solution img 6"
            width={309}
            height={410}
            className="object-cover sm:hidden"
          />
        </div>
        <span className="font-switzer text-black-3 text-xs tracking-[-2%] sm:text-sm">
          Under the hood, a relational data model that reflects the business, with jobs, values,
          documents and money as connected records rather than four disconnected exports. Scheduled
          jobs handle the syncing people used to do by hand. Protected, permissioned interfaces mean
          every part of the platform reads from one source of truth.
        </span>
        <div className="border-brand-blue flex flex-col gap-2 border-l-2 bg-white px-3.5 py-3 sm:px-6 sm:py-5.5">
          <span className="text-brand-blue font-switzer text-xs tracking-[-2%]">
            Note on disclosure
          </span>
          <p className="text-black-2 font-switzer text-base tracking-[-2%]">
            We stay deliberately non-specific about our stack in public. Naming every component of a
            client’s architecture is a security disclosure, not a portfolio piece.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Solution;
