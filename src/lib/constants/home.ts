import { IHome } from "@/types";
import { bookingHref } from "@/lib/constants/booking";
import { PROJECTS } from "@/lib/constants/work";

// The seated figures in the wallpaper video (they never move), left to right (`x` is % of the image's width).
const DESKTOP_PEOPLE = [
  { name: "Austin Page", x: 38.2 },
  { name: "Aayush Bajaj", x: 44.05 },
  { name: "Waleed Ali Khan", x: 49.1 },
  { name: "Ally Majelan", x: 54.3 },
  { name: "Sameer Siddiqui", x: 59.75 },
];

// "page-flooring" -> "Page Flooring": the fallback for a project without a `name`.
const toTitle = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

// Every case study becomes a file in the desktop's Projects folder, named after the client.
const DESKTOP_PROJECT_FILES = PROJECTS.flatMap((project) => {
  if (typeof project.slug !== "string" || !project.cardImg) return [];
  return [
    {
      name: project.name ?? toTitle(project.slug.split("/").pop() ?? ""),
      href: project.slug,
      kind: project.tags?.join(" · "),
      img: { url: String(project.cardImg.url), alt: project.cardImg.alt ?? "" },
    },
  ];
});

export const HOME_SECTION: IHome = {
  hero: {
    title: "Your embedded, AI-native design & dev squad.",
    description:
      "A small senior squad of AI-native designers and developers that joins your team, works in your tools, and ships toward your goals.",
    cta: { label: "Start your new project", href: "/contact" },
  },
  desktop: {
    wallpaper: "/hero-os/wallpaper.webp",
    video: {
      // 2560px for desktops (the screen goes full-bleed); phones show a crop, so 1920px is plenty.
      sources: [
        { src: "/hero-os/wallpaper-sm.webm", type: "video/webm", media: "(max-width: 767px)" },
        { src: "/hero-os/wallpaper-sm.mp4", type: "video/mp4", media: "(max-width: 767px)" },
        { src: "/hero-os/wallpaper.webm", type: "video/webm" },
        { src: "/hero-os/wallpaper.mp4", type: "video/mp4" },
      ],
      stillAt: 2.5,
      // 1 is the clip's own pace. Slowed a touch so the sky drifts rather than rushes; much
      // below 0.7 the 24fps source starts to look steppy.
      playbackRate: 0.8,
    },
    contact: {
      label: "Contact Us",
      href: "/contact",
      img: { url: "/hero-os/contact.webp", alt: "", width: 68, height: 45 },
    },
    icons: [
      {
        label: "Switch to Desktop",
        fullLabel: "Exit Desktop",
        img: { url: "/hero-os/computer.webp", alt: "", width: 60, height: 60 },
      },
      {
        label: "Pricing",
        href: bookingHref("hero-pricing"),
        img: { url: "/hero-os/pricing.webp", alt: "", width: 86, height: 56 },
      },
      {
        label: "Services",
        href: "/services",
        img: { url: "/hero-os/services.webp", alt: "", width: 61, height: 49 },
      },
      {
        label: "Company",
        href: "/company",
        img: { url: "/hero-os/company.svg", alt: "", width: 32, height: 32 },
      },
    ],
    folder: {
      label: "Projects",
      href: "/work",
      files: DESKTOP_PROJECT_FILES,
      shortcuts: [
        { label: "All work", href: "/work" },
        { label: "Services", href: "/services" },
        { label: "Company", href: "/company" },
        { label: "Contact", href: "/contact" },
      ],
    },
    people: DESKTOP_PEOPLE,
  },
  services: {
    eyebrow: "How we partner with you",
    title: "From Idea to Momentum",
    description:
      "You bring the industry, customer insights, and ambition. We help turn those ideas into brands, products, and systems that drive growth. From 0 -> 1 to Version 100, we embed with your team as a small squad and evolve with you.",
  },
  work: {
    eyebrow: "Outcomes over deliverables",
    title: "Featured Work",
    description:
      "We don't measure success by pages designed or features launched. We measure success by business impact. Every project should move the business forward.",
  },
};
