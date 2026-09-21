import { PFHeading } from "@/app/work/page-flooring/_components/platform/Outcome";
import ImageGrid, { Gallery } from "@/app/work/page-flooring/_components/rebrand/ImageGrid";
import Section from "@/components/layout/sections/Section";
import BannerHeading from "@/components/ui/headings/BannerHeading";
import img from "@public/page-flooring/rebrand/img-2.webp";
import img2 from "@public/page-flooring/rebrand/img-3.webp";
import img3 from "@public/page-flooring/rebrand/img-4.webp";

const GALLERY: Gallery[] = [
  {
    label: "Hero image",
    images: [
      {
        src: img,
        alt: "Problem image 1",
      },
      {
        src: img2,
        alt: "Problem image 2",
      },
      {
        src: img3,
        alt: "Problem image 3",
      },
    ],
  },
];

const Problem: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="border-x py-10 md:py-16 flex flex-col md:gap-8 gap-4"
    >
      <div className="flex flex-col gap-4">
        <PFHeading caption="Problem" />
        <BannerHeading
          title="There's a real cost to looking smaller than you are."
          titleClassName="md:text-h3! font-switzer text-2xl! font-medium tracking-[-2%]"
          description="Page Flooring was doing serious commercial work and running it on custom software they'd commissioned themselves. Their digital presence said none of that."
        />
      </div>
      {GALLERY.map((c) => (
        <ImageGrid key={c.label} {...c} />
      ))}
    </Section>
  );
};

export default Problem;
