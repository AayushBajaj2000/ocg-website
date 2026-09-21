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
      image: {
        url: "/avatars/austin-page-lg.webp",
        alt: "Austin Page, Co-Founder of OpenCore Group",
      },
    },
    {
      _type: "metric",
      _key: "churn",
      // From the Fraîche Table case study results in Sanity ("-15% Churn").
      label: "Less churn for Fraîche Table after the rebuild",
      value: 15,
      suffix: "%",
      accent: true,
    },
    {
      _type: "metric",
      _key: "experience",
      label: "Years of experience",
      value: 5,
      suffix: "+",
    },
    { _type: "metric", _key: "projects", label: "Projects shipped", value: 20, suffix: "+" },
  ],
};
