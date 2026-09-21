import { PFHeading } from "@/app/work/page-flooring/_components/platform/Outcome";
import ImageGrid, { type Gallery } from "@/app/work/page-flooring/_components/rebrand/ImageGrid";
import Section from "@/components/layout/sections/Section";

export type GallerySectionContent = {
  caption: string;
  title: string;
  description?: string;
  titleClassName?: string;
  gallery: Gallery;
};

type Props = GallerySectionContent & {
  /** Set for the section at the top of the page so its images load first. */
  eager?: boolean;
};

const GallerySection: React.FC<Props> = ({
  caption,
  title,
  description,
  titleClassName,
  gallery,
  eager,
}) => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-8 gap-4"
    >
      <PFHeading
        caption={caption}
        title={title}
        description={description}
        titleClassName={titleClassName}
      />
      <ImageGrid eager={eager} {...gallery} />
    </Section>
  );
};

export default GallerySection;
