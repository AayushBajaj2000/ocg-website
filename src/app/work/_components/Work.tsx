import FaqSection from "@/components/layout/FaqSection";
import Banner from "@/components/layout/Banner";
import Projects from "@/app/work/_components/Projects";
import PageDivider from "@/components/ui/PageDivider";
import { WORK_SECTION } from "@/lib/constants";
import BuildingSection from "@/components/layout/BuildingSection";

const Work: React.FC = () => {
  return (
    <>
      <Banner title={WORK_SECTION.title} description={WORK_SECTION.description} />
      <Projects projects={WORK_SECTION.projects} />
      <PageDivider />
      <FaqSection />
      <PageDivider />
      <BuildingSection />
    </>
  );
};

export default Work;
