import Banner from "@/app/work/anesthesia-one/_components/app/Banner";
import Hero from "@/app/work/anesthesia-one/_components/app/Hero";
import Intro from "@/app/work/anesthesia-one/_components/app/Intro";
import Problem from "@/app/work/anesthesia-one/_components/app/Problem";
import Process from "@/app/work/anesthesia-one/_components/app/Process";
import Results from "@/app/work/anesthesia-one/_components/app/Results";
import Solution from "@/app/work/anesthesia-one/_components/app/Solution";
import PageDivider from "@/components/ui/dividers/PageDivider";

const AppWebapp: React.FC = () => {
  return (
    <div className="bg-white">
      <Hero />
      <PageDivider />
      <Intro />
      <PageDivider />
      <Problem />
      <PageDivider />
      <Process />
      <PageDivider />
      <Solution />
      <PageDivider />
      <Results />
      <PageDivider />
      <Banner />
    </div>
  );
};

export default AppWebapp;
