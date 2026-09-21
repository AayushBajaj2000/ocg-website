import Image from "next/image";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { StripeReveal } from "@/components/ui/animations/StripeReveal";

const HowWeWork: React.FC = () => {
  return (
    <Section as="section" container containerClassName="md:py-16 py-10 border-x">
      <div className="flex flex-col gap-2">
        <span className="font-switzer text-xs tracking-[-2%] text-neutral-400 uppercase">
          How we work
        </span>
        <div className="flex flex-col gap-5">
          <StripeReveal
            as="h2"
            className="md:text-h3 font-switzer text-black-1 text-2xl font-medium tracking-[-2%]"
          >
            Three years in, we&apos;re still building Fraiche together.
          </StripeReveal>
          <Reveal
            as="p"
            className="text-black-3 font-switzer max-w-245.5 text-sm tracking-[-2%] md:text-xl"
          >
            We joined their team&apos;s channels and worked alongside them every day. We answered
            questions within minutes, on Slack, ran weekly sprints, and held regular calls to make
            sure we worked as an extension of their team.
          </Reveal>
          <Image
            src="/fraiche-table/img-2.webp"
            alt="collaboration board"
            width={1136}
            height={639}
            className="hidden object-cover sm:block"
          />
          <Image
            src="/fraiche-table/img-2-mob.webp"
            alt="collaboration board mobile"
            width={309}
            height={250}
            className="w-full object-cover sm:hidden"
          />
        </div>
      </div>
    </Section>
  );
};

export default HowWeWork;
