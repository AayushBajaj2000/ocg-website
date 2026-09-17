import DiscoveryCall from "@/components/ui/misc/DiscoveryCall";
import { DISCOVERY } from "@/lib/constants";

export const ContactDivider: React.FC = () => {
  return (
    <div className="flex items-center gap-5">
      <span className="bg-hairline h-px flex-1" />
      <span className="font-switzer text-sm tracking-[-4%]">or</span>
      <span className="bg-hairline h-px flex-1" />
    </div>
  );
};

export const ContactLeft: React.FC = () => {
  return (
    <div className="flex w-full flex-col lg:gap-20">
      <div className="flex flex-col px-4 md:px-5 lg:gap-2 lg:pt-20 xl:px-16">
        <h1 className="font-switzer lg:text-contact-desktop text-footer-mobile text-black-1 font-medium tracking-[-2%] md:text-5xl">
          Get a quote
        </h1>
        <p className="font-switzer text-black-1 text-sm tracking-[-2%] md:text-lg lg:text-2xl">
          Need a squad on your team? Let&apos;s talk!
        </p>
      </div>
      <div className="hidden lg:block">
        <ContactDivider />
      </div>
      <div className="hidden lg:block">
        <DiscoveryCall
          heading={DISCOVERY.heading}
          subheading={DISCOVERY.subheading}
          host={DISCOVERY.host}
          cta={DISCOVERY.cta}
          className="md:px-6.25"
        />
      </div>
    </div>
  );
};
