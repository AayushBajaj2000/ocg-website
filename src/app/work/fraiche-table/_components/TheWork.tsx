import WorkExplorer from "@/app/work/fraiche-table/_components/WorkExplorer";
import Section from "@/components/layout/sections/Section";
import BannerHeading from "@/components/ui/headings/BannerHeading";

const TheWork: React.FC = () => {
  return (
    <Section as="section" container containerClassName="md:py-16 py-10 border-x">
      <div className="flex flex-col gap-4 md:gap-7">
        <div className="flex flex-col gap-2">
          <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
            The work
          </span>
          <BannerHeading
            title="One partnership, three case studies"
            description="Each one builds on the last. Open any chapter for the full problem, process and solution."
          />
        </div>
        <WorkExplorer />
      </div>
    </Section>
  );
};

export default TheWork;
