import type { ITrustedBy } from "@/types";

export const TRUSTED_BY_SECTION: ITrustedBy = {
  title: "Trusted by 20+ businesses & startups",
  cta: {
    _type: "cta",
    _key: "cta",
    label: "This spot is for you,",
    linkLabel: "let’s talk.",
    href: "/contact",
  },
  // Tenth tile: with eleven clients the grid closes as two full rows of six on desktop.
  ctaIndex: 9,
  stats: [
    {
      _type: "highlight",
      _key: "founders",
      label: "Trusted by 20+ founders, operators, and growing businesses across Canada.",
      image: { url: "/avatars/austin-page-lg.webp", alt: "Austin, OpenCore client" },
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
