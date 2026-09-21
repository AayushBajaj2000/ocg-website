import { HERO, SECTIONS } from "@/app/work/page-flooring/_components/rebrand/content";
import GallerySection from "@/app/work/page-flooring/_components/rebrand/GallerySection";
import Problem from "@/app/work/page-flooring/_components/rebrand/Problem";
import PageDivider from "@/components/ui/dividers/PageDivider";
import Section from "@/components/layout/sections/Section";
import FillHeading from "@/components/ui/headings/FillHeading";
import { Fragment } from "react";

const Rebrand: React.FC = () => {
  return (
    <div className="bg-neutral-50">
      <GallerySection eager {...HERO} />
      <PageDivider />
      <Problem />
      <PageDivider />
      <Section as="section" container containerClassName="md:py-50 py-16 border-x">
        <FillHeading
          text="The capability was never the problem. The presentation was."
          className="md:text-hero-desktop! mx-auto text-center font-medium"
        />
      </Section>
      {SECTIONS.map((section) => (
        <Fragment key={section.caption}>
          <PageDivider />
          <GallerySection {...section} />
        </Fragment>
      ))}
    </div>
  );
};

export default Rebrand;
