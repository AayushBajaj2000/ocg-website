import { IHome } from "@/types";
import { bookingHref } from "@/lib/constants/booking";

// The seated figures in the wallpaper, left to right (`x` is % of the image's width).
const DESKTOP_PEOPLE = [
  { name: "Austin Page", x: 38.9 },
  { name: "Aayush Bajaj", x: 44.85 },
  { name: "Waleed Ali Khan", x: 50 },
  { name: "Ally Majelan", x: 55.15 },
  { name: "Sameer Siddiqui", x: 60.65 },
];

export const HOME_SECTION: IHome = {
  hero: {
    title: "Your embedded, AI-native design & dev squad.",
    description:
      "A small senior squad of AI-native designers and developers that joins your team, works in your tools, and ships toward your goals.",
    cta: { label: "Start your new project", href: "/contact" },
  },
  desktop: {
    wallpaper: "/hero-os/wallpaper.webp",
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
    projects: [
      {
        label: "Fraiche.project",
        href: "/work/fraiche-table",
        img: { url: "/hero-os/fraiche.webp", alt: "", width: 80, height: 52 },
      },
      {
        label: "PF1.project",
        href: "/work",
        img: { url: "/hero-os/pf1.webp", alt: "", width: 80, height: 52 },
      },
    ],
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
