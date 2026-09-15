import type { IService, IServices, PortableTextBlock } from "@/types";

const bullet = (key: string, text: string): PortableTextBlock => ({
  _type: "block",
  _key: key,
  style: "normal",
  listItem: "bullet",
  level: 1,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
});

const BRAND_IDENTITY: Omit<IService, "_key"> = {
  title: "Brand Identity",
  video: {
    sources: [{ src: "/placeholders/brand-identity.mp4", type: "video/mp4" }],
    width: 1080,
    height: 1080,
  },
  content: [
    {
      _type: "block",
      _key: "intro",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "intro-span",
          text: "Positioning, messaging, identity systems, and websites that build trust. A strong brand helps customers understand who you are, why you matter, and why they should choose you.",
          marks: [],
        },
      ],
    },
    bullet("logo", "Logo & visual identity"),
    bullet("guidelines", "Brand guidelines & systems"),
    bullet("naming", "Naming & verbal identity"),
    bullet("social", "Social & content templates"),
    bullet("pitch", "Pitch decks & investor collateral"),
    bullet("strategy", "Brand strategy & positioning"),
  ],
  cta: { label: "Let’s discuss your project", href: "/contact" },
};

export const SERVICES_SECTION: IServices = {
  title: "Built Around Your Business",
  description:
    "Some need a better customer experience. Others need the technology and systems required to support growth. Most need a combination of all three. That's where we help.",
  services: Array.from({ length: 4 }, (_, index) => ({
    ...BRAND_IDENTITY,
    _key: `brand-identity-${index + 1}`,
  })),
};
