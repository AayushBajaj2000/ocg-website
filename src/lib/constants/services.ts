import type { IService, IServices, IVideo, PortableTextBlock } from "@/types";

const paragraph = (key: string, text: string): PortableTextBlock => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
});

const bullet = (key: string, text: string): PortableTextBlock => ({
  _type: "block",
  _key: key,
  style: "normal",
  listItem: "bullet",
  level: 1,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
});

const video = (name: string): IVideo => ({
  sources: [{ src: `/services/${name}.mp4`, type: "video/mp4" }],
  width: 1080,
  height: 1080,
});

const BRAND_IDENTITY: IService = {
  _key: "brand-identity",
  title: "Brand Identity",
  video: video("brand-identity"),
  content: [
    paragraph(
      "intro",
      "Build a brand people recognize, understand, and trust. We shape the strategy, identity, and systems your team needs to stay consistent across every customer touchpoint.",
    ),
    bullet("positioning", "Positioning & messaging"),
    bullet("logo", "Logo & visual identity"),
    bullet("guidelines", "Brand guidelines & systems"),
    bullet("marketing", "Marketing & social assets"),
    bullet("pitch", "Pitch decks & sales collateral"),
    bullet("website", "Website creative direction"),
  ],
  cta: { label: "Explore Brand Identity →", href: "/services" },
};

const PRODUCT_DESIGN: IService = {
  _key: "product-design",
  title: "Product Design",
  video: video("product-design"),
  content: [
    paragraph(
      "intro",
      "Turn complex ideas into products people understand and enjoy using. We design clear user journeys and interfaces that move smoothly from concept to development.",
    ),
    bullet("strategy", "Product & UX strategy"),
    bullet("flows", "User flows & wireframes"),
    bullet("ui-ux", "UI/UX design"),
    bullet("prototypes", "Interactive prototypes"),
    bullet("design-systems", "Design systems"),
    bullet("usability", "Usability & iteration"),
  ],
  cta: { label: "Explore Product Design →", href: "/services" },
};

const CUSTOM_DEVELOPMENT: IService = {
  _key: "custom-development",
  title: "Custom Development",
  video: video("custom-development"),
  content: [
    paragraph(
      "intro",
      "Build technology around how your business actually works. We develop scalable websites, platforms, and applications designed for performance, flexibility, and long-term growth.",
    ),
    bullet("web", "Websites & web applications"),
    bullet("front-end", "Front-end development"),
    bullet("back-end", "Back-end systems"),
    bullet("cms", "CMS & content platforms"),
    bullet("integrations", "APIs & third-party integrations"),
    bullet("performance", "Performance, testing & optimization"),
  ],
  cta: { label: "Explore Development →", href: "/services" },
};

const AI_SOLUTIONS: IService = {
  _key: "ai-solutions",
  title: "AI Solutions",
  video: video("ai-solution"),
  content: [
    paragraph(
      "intro",
      "Use AI where it creates real business value. We build practical AI tools, automations, and integrations that reduce repetitive work and make products and teams more capable.",
    ),
    bullet("features", "AI product features"),
    bullet("automation", "Workflow automation"),
    bullet("llm", "LLM & API integrations"),
    bullet("internal", "Internal AI tools"),
    bullet("knowledge", "Knowledge & data systems"),
    bullet("strategy", "AI strategy & prototyping"),
  ],
  cta: { label: "Explore AI Solutions →", href: "/services" },
};

export const SERVICES_SECTION: IServices = {
  title: "Built Around Your Business",
  description:
    "Some need a better customer experience. Others need the technology and systems required to support growth. Most need a combination of all three. That's where we help.",
  services: [BRAND_IDENTITY, PRODUCT_DESIGN, CUSTOM_DEVELOPMENT, AI_SOLUTIONS],
};
