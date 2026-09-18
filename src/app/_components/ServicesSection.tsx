import Section from "@/components/layout/sections/Section";
import ServiceAccordions from "@/components/layout/sections/ServiceAccordions";
import SectionHeading from "@/components/ui/headings/SectionHeading";
import { HOME_SECTION, SERVICES_SECTION } from "@/lib/constants";

const ServicesSection: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="border-x border-hairline-dark! py-11 md:py-20 flex flex-col md:gap-15 gap-8"
      className="bg-black-1"
    >
      <div className="mx-auto flex max-w-163.5 flex-col gap-2 text-center md:gap-4">
        <span className="font-switzer text-xs tracking-[-2%] text-neutral-100 uppercase md:text-base">
          {HOME_SECTION.services.eyebrow}
        </span>
        <SectionHeading
          title={HOME_SECTION.services.title}
          description={HOME_SECTION.services.description}
          titleClassName="text-neutral-50"
          descriptionClassName="text-neutral-300 max-w-full!"
        />
      </div>
      <ServiceAccordions services={SERVICES_SECTION.services} isDark />
    </Section>
  );
};

export default ServicesSection;
