import type { ITestimonial, ITrustedBy, ITrustedByClient, ITrustedByLogo } from "@/types";

const testimonial = (company: string): ITestimonial => ({
  feedback:
    "This is going to be the content of the testimonial that i’ve created above in 2-3 lines of text with person name and role added as well in it.",
  client: {
    name: "Steve Page",
    role: `Founder of ${company}`,
    img: { url: "/placeholders/client.webp", alt: "Steve Page" },
  },
});

const client = (key: string, logo: ITrustedByLogo): ITrustedByClient => ({
  _type: "client",
  _key: key,
  logo,
  testimonial: testimonial(logo.alt),
});

export const TRUSTED_BY_SECTION: ITrustedBy = {
  title: "Trusted by 20+ businesses & startups",
  items: [
    client("taurus", {
      url: "/clients/taurus.svg",
      alt: "Taurus Contracting",
      width: 105,
      height: 28,
    }),
    client("ocg", { url: "/clients/ocg.svg", alt: "OpenCore", width: 144, height: 24 }),
    client("efunders", { url: "/clients/efunders.svg", alt: "eFundrs", width: 102, height: 28 }),
    client("fraiche", {
      url: "/clients/fraichetable.svg",
      alt: "Fraîche Table",
      width: 157,
      height: 24,
    }),
    client("eclectic", {
      url: "/clients/eclectic.svg",
      alt: "Eclectic Events",
      width: 121,
      height: 28,
    }),
    client("campus-gate", {
      url: "/clients/campus-gate.svg",
      alt: "Campus Gate Residences",
      width: 165,
      height: 28,
    }),
    client("beegirls", { url: "/clients/beegirls.svg", alt: "Beegirl’s", width: 91, height: 40 }),
    client("anesthesia-one", {
      url: "/clients/ao.svg",
      alt: "Anesthesia One",
      width: 190,
      height: 37,
    }),
    client("dr-whiff", { url: "/clients/dr-whiff.svg", alt: "Dr. Whiff", width: 49, height: 36 }),
    {
      _type: "cta",
      _key: "cta",
      label: "This spot is for you,",
      linkLabel: "let’s talk.",
      href: "/contact",
    },
    client("page-flooring", {
      url: "/clients/pageflooring.svg",
      alt: "Page Flooring",
      width: 104,
      height: 35,
    }),
    client("dentimatch", {
      url: "/clients/dentimatch.svg",
      alt: "DentiMatch",
      width: 162,
      height: 24,
    }),
  ],
  stats: [
    {
      _type: "highlight",
      _key: "founders",
      label: "Trusted by 20+ founders, operators, and growing businesses across Canada.",
      image: { url: "/avatars/austin-lg.webp", alt: "Austin, OpenCore client" },
    },
    {
      _type: "metric",
      _key: "retention",
      label: "Retention increase for our clients",
      value: 15,
      suffix: "%",
      accent: true,
    },
    {
      _type: "metric",
      _key: "experience",
      label: "Years of experiences - only A players",
      value: 5,
      suffix: "+",
    },
    { _type: "metric", _key: "projects", label: "Projects shipped", value: 20, suffix: "+" },
  ],
};
