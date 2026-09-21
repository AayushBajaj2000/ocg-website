import { PlusIcon } from "@/components/icons";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { AnimatedIconButton } from "@/components/ui/buttons/AnimatedIconButton";
import { bookingHref } from "@/lib/constants/booking";
import Image from "next/image";

/**
 * The stethoscope artwork rises out of the top of the card, so the image carries
 * the card's top edge and the copy continues the same fill below it.
 */
const Banner: React.FC = () => {
  return (
    <Section as="section" container containerClassName="md:py-16 py-10 border-x">
      <div className="flex flex-col">
        <Image
          src="/anesthesia-one/app/banner.webp"
          alt="Stethoscope resting over icons for the handbook, drugs, syringe and calculator"
          width={2256}
          height={1700}
          sizes="(min-width: 1536px) 1128px, 100vw"
          className="mx-auto w-full max-w-282"
        />
        <div className="mx-auto flex w-full max-w-282 flex-col items-center gap-8 rounded-b-3xl bg-[#fafafa] px-6 pt-2 pb-12 text-center md:pb-18.75">
          <div className="flex flex-col items-center gap-4">
            <StripeReveal
              as="h2"
              className="md:text-footer-desktop font-switzer max-w-155 text-2xl font-medium tracking-[-2%] text-black md:leading-13.25"
            >
              Got something that isn&apos;t working the way it should?
            </StripeReveal>
            <Reveal
              as="p"
              className="font-switzer text-black-3 max-w-118.25 text-sm md:text-base"
              byLine
            >
              Sit down with us. We&apos;ll tell you what the problem is, whether or not you hire us
              to fix it.
            </Reveal>
          </div>
          <AnimatedIconButton
            href={bookingHref("case-study")}
            label="Book a call"
            icon={<PlusIcon className="size-4" />}
          />
        </div>
      </div>
    </Section>
  );
};

export default Banner;
