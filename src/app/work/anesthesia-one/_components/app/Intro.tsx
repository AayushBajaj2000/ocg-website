import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import Image from "next/image";

const Intro: React.FC = () => {
  return (
    <Section as="section" container containerClassName="md:py-16 py-10 border-x">
      <div className="relative flex flex-col gap-10 overflow-hidden rounded-3xl bg-neutral-50 px-6 py-10 md:min-h-84.5 md:flex-row md:items-center md:justify-between md:rounded-[1.69rem] md:py-0 md:pr-16 md:pl-18.5">
        <div className="flex max-w-149.25 flex-col gap-3.5">
          <StripeReveal
            as="h2"
            className="md:text-footer-desktop font-switzer text-2xl font-medium tracking-[-2%] text-[#414e5f] md:leading-13.25"
          >
            Creating a new mobile app and Uplifting their existing web app.
          </StripeReveal>
          <Reveal as="p" className="font-switzer text-sm text-neutral-500 md:text-base" byLine>
            The AnesthesiaOne team wanted to launch a new Mobile App and redesign their existing
            website app - creating a cross platform user experience that is enjoyable and
            performant.
          </Reveal>
        </div>

        {/* Logo tile with two faded outlines trailing off the card's top and bottom edges. */}
        <div aria-hidden className="relative h-37 w-72.75 shrink-0 md:h-auto md:self-stretch">
          <div className="border-anesthesia-orange absolute top-1/2 left-35.75 hidden size-37 -translate-y-[calc(50%+8.575rem)] rounded-[0.844rem] border-[0.844px] opacity-25 md:block" />
          <div className="border-anesthesia-orange absolute top-1/2 left-35.75 hidden size-37 -translate-y-[calc(50%-8.3125rem)] rounded-[0.844rem] border-[0.844px] opacity-25 md:block" />
          <div className="border-anesthesia-orange absolute top-1/2 left-0 grid size-37 -translate-y-1/2 place-content-center rounded-[0.844rem] border-[0.844px] bg-white">
            <Image
              src="/anesthesia-one/shared/logo-mark.svg"
              alt=""
              width={79}
              height={90}
              unoptimized
              className="h-22.5 w-19.75"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Intro;
