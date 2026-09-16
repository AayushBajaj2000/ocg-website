import Banner from "@/components/layout/sections/Banner";
import Section from "@/components/layout/sections/Section";
import ServiceAccordions from "@/components/layout/sections/ServiceAccordions";
import { SERVICES_SECTION } from "@/lib/constants";

const Services: React.FC = () => {
  return (
    <>
      <Banner title={SERVICES_SECTION.title} description={SERVICES_SECTION.description} />
      <Section
        as="section"
        container
        containerClassName="border-x border-x-hairline py-11 md:py-20"
      >
        <ServiceAccordions services={SERVICES_SECTION.services} />
      </Section>
    </>
  );
};

export default Services;
