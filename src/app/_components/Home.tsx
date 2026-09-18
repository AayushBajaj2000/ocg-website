import Hero from "@/app/_components/Hero";
import ServicesSection from "@/app/_components/ServicesSection";
import Testimonials from "@/app/_components/Testimonials";
import WorkSection from "@/app/_components/WorkSection";
import FounderSection from "@/components/layout/sections/FounderSection";
import Team from "@/components/layout/sections/Team";
import TrustedBy from "@/components/layout/sections/TrustedBy";
import PageDivider from "@/components/ui/dividers/PageDivider";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <TrustedBy />
      <PageDivider />
      <ServicesSection />
      <PageDivider />
      <WorkSection />
      <PageDivider />
      <Testimonials />
      <PageDivider />
      <FounderSection />
      <PageDivider />
      <Team />
    </>
  );
};

export default Home;
