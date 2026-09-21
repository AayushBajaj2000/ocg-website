import Section from "@/components/layout/sections/Section";
import AskMe from "@/components/layout/sections/AskMe";
import FaqAccordions from "@/components/layout/sections/FaqAccordions";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";
import { fetchFaqs } from "@/lib/faq/server";

const STEP = 0.06;
const ASK_ME_DELAY = STEP;
const FAQ_DELAY = STEP * 5;

const FaqSection = async () => {
  const faqs = await fetchFaqs();

  return (
    <Section
      container
      containerClassName="grid gap-12 lg:grid-cols-2 grid-cols-1 border-x border-x-hairline py-10 lg:py-20"
    >
      <div className="flex flex-col gap-12">
        <StripeReveal
          as="h2"
          className="text-hero-mobile mx-auto max-w-110 text-center font-medium text-black md:text-5xl lg:mx-0 lg:text-left"
        >
          Have question? We&apos;ve got answers!
        </StripeReveal>
        <div className="hidden lg:block">
          <AskMe delay={ASK_ME_DELAY} step={STEP} />
        </div>
      </div>
      <FaqAccordions faqs={faqs} delay={FAQ_DELAY} step={STEP} />
      <div className="lg:hidden">
        <AskMe delay={ASK_ME_DELAY} step={STEP} />
      </div>
    </Section>
  );
};

export default FaqSection;
