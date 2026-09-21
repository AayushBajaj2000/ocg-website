import Hero from "@/app/work/page-flooring/_components/platform/Hero";
import Outcome from "@/app/work/page-flooring/_components/platform/Outcome";
import Problem from "@/app/work/page-flooring/_components/platform/Problem";
import Process from "@/app/work/page-flooring/_components/platform/Process";
import Result from "@/app/work/page-flooring/_components/platform/Result";
import Solution from "@/app/work/page-flooring/_components/platform/Solution";
import PageDivider from "@/components/ui/dividers/PageDivider";

const Platform: React.FC = () => {
  return (
    <div className="bg-neutral-50">
      <Hero />
      <PageDivider />
      <Outcome />
      <PageDivider />
      <Problem />
      <PageDivider />
      <Process />
      <PageDivider />
      <Solution />
      <PageDivider />
      <Result />
    </div>
  );
};

export default Platform;
