import Banner from "@/components/layout/sections/Banner";
import Projects from "@/app/work/_components/Projects";
import { WORK_SECTION } from "@/lib/constants";

const Work: React.FC = () => {
  return (
    <>
      <Banner title={WORK_SECTION.title} description={WORK_SECTION.description} />
      <Projects projects={WORK_SECTION.projects} />
    </>
  );
};

export default Work;
