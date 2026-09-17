import { ContactDivider, ContactLeft } from "@/app/contact/_components/ContactBlocks";
import Section from "@/components/layout/sections/Section";
import ContactForm from "@/components/ui/forms/ContactForm";
import DiscoveryCall from "@/components/ui/misc/DiscoveryCall";
import { DISCOVERY } from "@/lib/constants";

const ContactBanner: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="xl:px-0! md:px-0! px-0! md:py-20 py-10 border-x"
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-0">
        <ContactLeft />
        <ContactForm />
        <div className="lg:hidden">
          <ContactDivider />
        </div>
        <div className="px-2.5 md:px-6.25 lg:hidden">
          <DiscoveryCall
            heading={DISCOVERY.heading}
            subheading={DISCOVERY.subheading}
            host={DISCOVERY.host}
            cta={DISCOVERY.cta}
          />
        </div>
      </div>
    </Section>
  );
};

export default ContactBanner;
