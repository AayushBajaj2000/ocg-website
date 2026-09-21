import type { ReactNode } from "react";
import Section from "@/components/layout/sections/Section";
import PageDivider from "@/components/ui/dividers/PageDivider";
import TableOfContents from "@/components/ui/misc/TableOfContents";

export interface ILegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

type Props = {
  title: string;
  /** ISO date the current text took effect. */
  effectiveDate: string;
  intro: string;
  sections: ILegalSection[];
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", { dateStyle: "long", timeZone: "UTC" });

/** Shared layout for the privacy policy and terms of use: header, sticky contents, numbered text. */
const LegalPage: React.FC<Props> = ({ title, effectiveDate, intro, sections }) => {
  return (
    <article>
      <Section as="header" container containerClassName="border-x py-10 md:py-16">
        <div className="mx-auto flex max-w-330 flex-col gap-5 md:gap-8">
          <p className="font-jetbrains-mono text-black-3 text-xs tracking-[6%] uppercase">
            Legal · Effective{" "}
            <time dateTime={effectiveDate}>{dateFormatter.format(new Date(effectiveDate))}</time>
          </p>
          <h1 className="text-hero-mobile md:text-hero-desktop text-black-1 font-medium tracking-[-2%]">
            {title}
          </h1>
          <p className="text-black-2 max-w-250 text-base tracking-[-2%] md:text-xl md:leading-7.5">
            {intro}
          </p>
        </div>
      </Section>

      <PageDivider />

      {/* `overflow-visible`: the container clips by default, which would stop the contents sticking. */}
      <Section container containerClassName="border-x py-10 md:py-15 overflow-visible!">
        <div className="mx-auto flex max-w-330 flex-col gap-8 lg:flex-row lg:gap-16">
          <TableOfContents items={sections.map(({ id, title: text }) => ({ id, text }))} />
          <div className="text-black-3 md:text-body-desktop text-body-mobile flex min-w-0 flex-1 flex-col gap-10 tracking-[-2%] md:gap-14 lg:max-w-250">
            {sections.map((section, index) => (
              <section
                key={section.id}
                aria-labelledby={section.id}
                className="[&_a]:text-brand-blue [&_strong]:text-black-1 flex flex-col gap-4 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:no-underline [&_li]:pl-1 [&_strong]:font-medium [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5"
              >
                <h2
                  id={section.id}
                  className="text-black-1 scroll-mt-28 text-2xl font-medium tracking-[-2%] md:scroll-mt-32 md:text-[2rem] md:leading-9.5"
                >
                  <span className="text-numeral mr-3">{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                {section.body}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </article>
  );
};

export default LegalPage;
