import FaqSection from "@/components/layout/FaqSection";
import Banner from "@/components/layout/Banner";
import Projects from "@/app/work/_components/Projects";
import WorkShader from "@/components/shaders/work-shader/WorkShader";
import PageDivider from "@/components/ui/PageDivider";
import { WORK_SECTION } from "@/lib/constants";

const Work: React.FC = () => {
  return (
    <>
      <Banner
        title={WORK_SECTION.title}
        description={WORK_SECTION.description}
        shader={<WorkShader />}
      />
      <Projects projects={WORK_SECTION.projects} />
      <PageDivider />
      <FaqSection />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default Work;
