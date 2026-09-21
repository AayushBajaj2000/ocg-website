import type { GallerySectionContent } from "@/app/work/page-flooring/_components/rebrand/GallerySection";
import img1 from "@public/page-flooring/rebrand/img-1.webp";
import img5 from "@public/page-flooring/rebrand/img-5.webp";
import img6 from "@public/page-flooring/rebrand/img-6.webp";
import img7 from "@public/page-flooring/rebrand/img-7.webp";
import img8 from "@public/page-flooring/rebrand/img-8.webp";
import img9 from "@public/page-flooring/rebrand/img-9.webp";
import img10 from "@public/page-flooring/rebrand/img-10.webp";
import img11 from "@public/page-flooring/rebrand/img-11.webp";
import img12 from "@public/page-flooring/rebrand/img-12.webp";
import img13 from "@public/page-flooring/rebrand/img-13.webp";
import img14 from "@public/page-flooring/rebrand/img-14.webp";
import img15 from "@public/page-flooring/rebrand/img-15.webp";
import img16 from "@public/page-flooring/rebrand/img-16.webp";
import img17 from "@public/page-flooring/rebrand/img-17.webp";
import img18 from "@public/page-flooring/rebrand/img-18.webp";
import img19 from "@public/page-flooring/rebrand/img-19.webp";
import img20 from "@public/page-flooring/rebrand/img-20.webp";
import img22 from "@public/page-flooring/rebrand/img-22.webp";
import img23 from "@public/page-flooring/rebrand/img-23.webp";

export const HERO: GallerySectionContent = {
  caption: "Rebranding",
  title: "New software deserved a new face.",
  description:
    "A full digital refresh, brand system and website, for a company whose capability had outgrown how it presented itself.",
  gallery: {
    label: "New Page Flooring website",
    images: [{ src: img1, alt: "Page Flooring's new website on a laptop" }],
  },
};

export const SECTIONS: GallerySectionContent[] = [
  {
    caption: "Before",
    title:
      "The existing brand of Page Flooring lacked the visual and functional attributes needed to convey their capabilities.",
    description:
      "Page Flooring had built a strong reputation for delivering premium flooring solutions, but the brand itself didn't reflect the quality of the business behind it. From the logo to the website, the visual identity lacked consistency, clarity, and a cohesive point of view. While the customer experience communicated craftsmanship, trust, and quality in the real world, those same qualities were getting lost across the brand's digital and visual touchpoints.",
    gallery: {
      label: "Page Flooring before the rebrand",
      images: [
        { src: img5, alt: "Page Flooring's previous website" },
        { src: img6, alt: "Page Flooring's previous logo" },
      ],
    },
  },
  {
    caption: "Process",
    titleClassName: "md:text-[2.5rem]/[3rem]!",
    title:
      "The same team that had spent months inside their operations did the brand work. We weren't guessing at who they are; we had already sat with every department. Design decisions came from the process mapping.",
    gallery: {
      label: "Rebrand process",
      images: [
        { src: img7, alt: "Logo work: variants explored and the final logo system" },
        { src: img8, alt: "Brand assets: business cards, letterhead and quotation" },
        { src: img9, alt: "Website design work across three versions and components" },
      ],
    },
  },
  {
    caption: "Solution",
    title: "A brand system and a site that position them by capability, not by category.",
    description:
      "A refreshed brand system and a rebuilt website that positions Page Flooring by capability rather than by category. Consistent with the platform their team uses every day, so the internal tool and the external face look like the same company.",
    gallery: {
      label: "Brand system",
      layout: ["half", "half", "full"],
      images: [
        { src: img10, alt: "Page logo on its construction grid" },
        { src: img11, alt: "Greyscale colour palette" },
        { src: img12, alt: "Gilroy typeface in SemiBold, Medium and Regular" },
      ],
    },
  },
  {
    caption: "Brand applications",
    title: "One company, inside and out.",
    description:
      "The same type, palette and structure as the platform their team signs into every morning.",
    gallery: {
      label: "Brand applications",
      images: [
        { src: img13, alt: "Branded Page Flooring van and pickup truck" },
        { src: img14, alt: "Illuminated Page logo above a reception desk" },
        { src: img15, alt: "Site hoarding reading Built on what lasts" },
        { src: img16, alt: "Page Flooring business cards" },
        { src: img17, alt: "Frosted Page logo on a warehouse window above a laptop" },
      ],
    },
  },
  {
    caption: "The website",
    title: "Capability, not category.",
    description:
      "Seven surfaces — carpet, resilient, tile, hardwood, epoxy, polishing, levelling — stated as scope, so a general contractor can see the whole package in one read.",
    gallery: {
      label: "The new website",
      images: [
        { src: img18, alt: "Project page on desktop and mobile" },
        { src: img19, alt: "Projects index on a desktop monitor" },
        { src: img20, alt: "About page on a tablet" },
        { src: img22, alt: "Open navigation menu" },
      ],
    },
  },
  {
    caption: "Projects & responsive design",
    title: "The project record as proof.",
    description:
      "Every job tagged by the surfaces it involved. The portfolio does the qualifying before the call happens.",
    gallery: {
      label: "Project management platform",
      images: [{ src: img23, alt: "Page Flooring platform on a laptop beside the Page sign" }],
    },
  },
];
