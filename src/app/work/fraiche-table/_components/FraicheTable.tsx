import Context from "@/app/work/fraiche-table/_components/Context";
import Hero from "@/app/work/fraiche-table/_components/Hero";
import HowWeWork from "@/app/work/fraiche-table/_components/HowWeWork";
import Results from "@/app/work/fraiche-table/_components/Results";
import TheWork from "@/app/work/fraiche-table/_components/TheWork";
import PageDivider from "@/components/ui/dividers/PageDivider";

const FraicheTable: React.FC = () => {
  return (
    <>
      <Hero />
      <PageDivider />
      <Context />
      <PageDivider />
      <TheWork />
      <PageDivider />
      <HowWeWork />
      <PageDivider />
      <Results />
    </>
  );
};

export default FraicheTable;
