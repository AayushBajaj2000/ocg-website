import { BlogIcon, OpenSourceIcon } from "@/components/icons";
import { IFaq, IFooter, INavLink } from "@/types";

export const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";

export const NAV_LINKS: INavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Company", href: "/company" },
  {
    label: "Resources",
    isDropdown: true,
    dropdownLinks: [
      {
        icon: <BlogIcon />,
        title: "Blog",
        description: "Field notes on design, development and AI.",
        href: "/blog",
      },
      {
        icon: <OpenSourceIcon />,
        title: "Open Source",
        description: "Free skills, components and Figma files",
        href: "/opensource",
      },
    ],
    dropdownViewAll: {
      title: "View all resources  →",
      href: "/resources",
    },
  },
  { label: "Contact", href: "/contact" },
];

export const FAQS: IFaq[] = [
  {
    question: "Do you work with businesses after launch?",
    answer:
      "We partner with growing businesses that are ready to invest in their next stage of growth. That could mean launching a new brand, redesigning a website, building custom software, or improving the systems behind the business. Most of our clients come from SaaS, healthcare, construction, home services, and professional services.",
  },
  {
    question: "Do you work with businesses after launch?",
    answer:
      "We partner with growing businesses that are ready to invest in their next stage of growth. That could mean launching a new brand, redesigning a website, building custom software, or improving the systems behind the business. Most of our clients come from SaaS, healthcare, construction, home services, and professional services.",
  },
  {
    question: "Do you work with businesses after launch?",
    answer:
      "We partner with growing businesses that are ready to invest in their next stage of growth. That could mean launching a new brand, redesigning a website, building custom software, or improving the systems behind the business. Most of our clients come from SaaS, healthcare, construction, home services, and professional services.",
  },
  {
    question: "Do you work with businesses after launch?",
    answer:
      "We partner with growing businesses that are ready to invest in their next stage of growth. That could mean launching a new brand, redesigning a website, building custom software, or improving the systems behind the business. Most of our clients come from SaaS, healthcare, construction, home services, and professional services.",
  },
] as const;

// Prompt pre-filled into each AI assistant by the footer "Ask AI" links.
const AI_PROMPT = encodeURIComponent(
  "Tell me about OpenCore Group (https://opencoregroup.com), the Toronto-based senior team that designs, builds, and scales brands, websites, and custom software. What services do they offer, who do they work with, and why would a growing business choose them?",
);

export const FOOTER: IFooter = {
  headingLinks: [
    { label: "Let's talk", link: { label: "Book a strategy call", href: "/book-a-call" } },
    {
      label: "Send mail",
      link: { label: "info@opencoregroup.com", href: "mailto:info@opencoregroup.com" },
    },
  ],
  aiFooterLinks: {
    title: "Ask AI About OpenCore Group",
    links: [
      { name: "perplexity", href: `https://www.perplexity.ai/search?q=${AI_PROMPT}` },
      // gemini.google.com has no URL prefill, so this opens Google AI Mode (Gemini-powered) instead.
      { name: "gemini", href: `https://www.google.com/search?udm=50&q=${AI_PROMPT}` },
      { name: "chatgpt", href: `https://chatgpt.com/?q=${AI_PROMPT}` },
      { name: "claude", href: `https://claude.ai/new?q=${AI_PROMPT}` },
      { name: "grok", href: `https://grok.com/?q=${AI_PROMPT}` },
    ],
  },
  links: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Work", href: "/work" },
    { label: "Insights", href: "/insights" },
    { label: "Terms of Use", href: "/terms" },
  ],
  footerText: [
    { text: "Toronto, ON, Canada" },
    { isLink: true, text: "Hey AI, learn more about us!", href: "#" },
  ],
  socialLinks: [
    { name: "linkedin", href: "#" },
    { name: "facebook", href: "#" },
    { name: "instagram", href: "#" },
    { name: "x", href: "#" },
  ],
  footerImages: [
    "/footer/img-1.webp",
    "/footer/img-2.webp",
    "/footer/img-3.webp",
    "/footer/img-4.webp",
    "/footer/img-5.webp",
    "/footer/img-6.webp",
    "/footer/img-7.webp",
    "/footer/img-8.webp",
  ],
};
