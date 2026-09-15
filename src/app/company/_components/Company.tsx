import Team from "@/app/_components/Team";
import TrustedBy from "@/app/_components/TrustedBy";
import WordSection from "@/app/_components/WordSection";
import Banner from "@/components/layout/Banner";
import PageDivider from "@/components/ui/PageDivider";
import { COMPANY_SECTION } from "@/lib/constants";

const Company: React.FC = () => {
  return (
    <>
      <Banner title={COMPANY_SECTION.title} description={COMPANY_SECTION.description} />
      <TrustedBy />
      <PageDivider />
      <WordSection />
      <PageDivider />
      <Team />
    </>
  );
};

export default Company;
