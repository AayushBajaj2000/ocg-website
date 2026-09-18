import Section from "@/components/layout/sections/Section";
import ProjectCard from "@/components/ui/cards/ProjectCard";
import SectionHeading from "@/components/ui/headings/SectionHeading";
import { HOME_SECTION, WORK_SECTION } from "@/lib/constants";

const WorkSection: React.FC = () => {
  return (
    <Section container containerClassName="border-x md:pb-16 pb-10 md:pt-10 pt-14 grid gap-16">
      <div className="mx-auto flex max-w-163.5 flex-col gap-2 text-center md:gap-4">
        <span className="font-switzer text-black-3 text-xs tracking-[-2%] uppercase md:text-base">
          {HOME_SECTION.work.eyebrow}
        </span>
        <SectionHeading
          title={HOME_SECTION.work.title}
          description={HOME_SECTION.work.description}
        />
      </div>
      {WORK_SECTION.projects?.map((project, i) => (
        <ProjectCard
          key={`${project.title}-${project.slug}-${i}`}
          {...project}
          rtl={i % 2 !== 0}
          priority
        />
      ))}
    </Section>
  );
};

export default WorkSection;
