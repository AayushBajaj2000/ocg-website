import Section from "@/components/layout/sections/Section";
import ProjectCard from "@/components/ui/cards/ProjectCard";
import { IProject } from "@/types";

type Props = {
  projects?: IProject[];
};

const Projects: React.FC<Props> = ({ projects }) => {
  return (
    <Section container containerClassName="border-x md:pb-16 pb-10 md:pt-10 pt-14 grid gap-16">
      {projects?.map((project, i) => (
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

export default Projects;
