import type { Metadata } from "next";

export const SITE_NAME = "OpenCore Group";

interface IPageSeo {
  path: string;
  /** Browser/search title. Pages other than home get " | OpenCore Group" appended. */
  title: string;
  description: string;
  /** Small label above the headline on the share image. */
  eyebrow: string;
  /** Headline on the share image; kept short enough for three lines. */
  headline: string;
}

// One entry per static page: the single source for its <title>, description, canonical, social
// card and sitemap entry. Blog posts build theirs from Sanity in `src/app/blog/[slug]/page.tsx`.
// Every sentence here is a claim the page itself already makes.
export const PAGE_SEO = {
  home: {
    path: "/",
    title: "OpenCore Group | Embedded, AI-native design & development squad",
    description:
      "A small senior squad of AI-native designers and developers that joins your team, works in your tools, and ships toward your goals. Based in Toronto.",
    eyebrow: "Toronto, Canada",
    headline: "Your embedded, AI-native design & dev squad.",
  },
  work: {
    path: "/work",
    title: "Work",
    description:
      "Case studies from OpenCore Group: brands, platforms and AI features for SaaS, healthcare and construction teams, measured by business outcomes.",
    eyebrow: "Work",
    headline: "Outcomes over deliverables.",
  },
  fraicheTable: {
    path: "/work/fraiche-table",
    title: "Fraîche Table case study",
    description:
      "Fraîche Table's meal-planning platform had outgrown the tool it ran on. We rebuilt the foundation, then shipped three years of roadmap in one.",
    eyebrow: "Case study · Fraîche Table",
    headline: "A vision that outgrew its platform. We built one that could keep up.",
  },
  pageFlooring: {
    path: "/work/page-flooring",
    title: "Page Flooring case study",
    description:
      "Five systems, three logins and a dozen workarounds, replaced with one platform Page Flooring owns, and a rebrand to match what the company had become.",
    eyebrow: "Case study · Page Flooring",
    headline: "Five systems and a dozen workarounds, replaced with one platform they own.",
  },
  anesthesiaOne: {
    path: "/work/anesthesia-one",
    title: "Anesthesia One case study",
    description:
      "A physician needed a clinical reference tool for anesthesia professionals. We designed and built the mobile app, the web platform and the brand.",
    eyebrow: "Case study · Anesthesia One",
    headline: "Clinical reference software, built to the standard clinicians expect.",
  },
  services: {
    path: "/services",
    title: "Services",
    description:
      "Brand identity, product design, custom development and AI solutions from one senior team that embeds with yours, from first version to version 100.",
    eyebrow: "Services",
    headline: "Brand, product, development and AI, built around your business.",
  },
  company: {
    path: "/company",
    title: "Company",
    description:
      "OpenCore Group is a small senior team in Toronto. No layers, no hand-offs: you work directly with the people designing and building your product.",
    eyebrow: "Company",
    headline: "Helping you shape what comes next.",
  },
  blog: {
    path: "/blog",
    title: "Blog",
    description:
      "Field notes on design, development and AI from OpenCore Group: what we're building, what we're learning, and what moves a business forward.",
    eyebrow: "Blog",
    headline: "Field notes on design, development and AI.",
  },
  resources: {
    path: "/resources",
    title: "Resources",
    description:
      "Free skills, components, Figma files and starters from OpenCore Group – the same resources we use on real client work.",
    eyebrow: "Open source",
    headline: "Free components, Figma files and starters.",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description:
      "Tell us what you're building. Send OpenCore Group a project brief and get a reply from the people who would design and build it.",
    eyebrow: "Contact",
    headline: "Need a squad on your team? Let's talk.",
  },
  bookACall: {
    path: "/book-a-call",
    title: "Book a call",
    description:
      "Book an intro call with OpenCore Group to talk through your project, timeline and the squad that would fit it.",
    eyebrow: "Book a call",
    headline: "Book an intro call with the team.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "What OpenCore Group collects when you visit opencoregroup.com, why, which services help us process it, and how to change your cookie choice.",
    eyebrow: "Legal",
    headline: "Privacy Policy",
  },
  terms: {
    path: "/terms",
    title: "Terms of Use",
    description:
      "The terms that cover your use of opencoregroup.com, including our free resources. Governed by the laws of Ontario, Canada.",
    eyebrow: "Legal",
    headline: "Terms of Use",
  },
} as const satisfies Record<string, IPageSeo>;

export type PageSeoKey = keyof typeof PAGE_SEO;

export const shareImagePath = (key: PageSeoKey) => `/og/${key}`;

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Title, description, canonical and social card for a static page. */
export const pageMetadata = (key: PageSeoKey): Metadata => {
  const page: IPageSeo = PAGE_SEO[key];
  const title = key === "home" ? page.title : `${page.title} | ${SITE_NAME}`;
  const images = [{ url: shareImagePath(key), ...SHARE_IMAGE_SIZE, alt: page.headline }];

  return {
    title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title,
      description: page.description,
      url: page.path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_CA",
      images,
    },
    twitter: { card: "summary_large_image", title, description: page.description, images },
  };
};
