import Team from "@/components/layout/sections/Team";
import TrustedBy from "@/components/layout/sections/TrustedBy";
import WordSection from "@/components/layout/sections/WordSection";
import Banner from "@/components/layout/sections/Banner";
import PageDivider from "@/components/ui/dividers/PageDivider";
import { COMPANY_SECTION } from "@/lib/constants";
import FounderSection from "@/components/layout/sections/FounderSection";

const Company: React.FC = () => {
  return (
    <>
      <Banner title={COMPANY_SECTION.title} description={COMPANY_SECTION.description} />
      <TrustedBy />
      <PageDivider />
      <WordSection />
      <PageDivider />
      <Team />
      <PageDivider />
      <FounderSection />
      <PageDivider />
    </>
  );
};

export default Company;
