import { IProject, IWork } from "@/types";

export const PROJECTS: IProject[] = [
  {
    title: "A vision that outgrew its platform. We built one that could keep up.",
    slug: "/work/fraiche-table",
    tags: ["B2C", "SaaS"],
    caption:
      "Fraîche Table had a growing audience and a meal-planning platform running on a tool that was never built for it. We rebuilt the foundation, then shipped three years of roadmap in one.",
    startDate: "01-01-2024",
    present: true,
    cardImg: {
      url: "/fraiche-table/card.webp",
      alt: "Fraîche Table meal-planning web app",
    },
    testimonial: {
      feedback:
        "OpenCore transformed our complex meal planning vision into a scalable platform, delivering seamless user experiences and supporting sustainable business growth",
      client: {
        name: "Victoria",
        role: "Founder, FraicheTable",
      },
    },
  },
  {
    title:
      "Five systems, three logins, and a dozen workarounds, replaced with one platform they own.",
    slug: "/work/page-flooring",
    tags: ["B2B", "Platform"],
    caption:
      "Page Flooring was paying prices for software that didn't do what their business does. We consolidated the whole stack into one piece of software built around their workflow – then gave the company a face that matched what it had become.",
    startDate: "01-01-2024",
    present: true,
    cardImg: {
      url: "/page-flooring/platform/hero.webp",
      alt: "Page Flooring project management platform",
    },
    testimonial: {
      feedback:
        "Very knowledgeable team! I must say from the start of our dealings right up until the end - I was thoroughly impressed with their communication, efficiency and ability to listen to our needs and translate that into a finished product! Highly recommend using OpenCore!",
      client: {
        name: "Dylan Page",
        role: "Page Flooring",
      },
    },
  },
  {
    title: "Clinical reference software, built to the standard clinicians expect.",
    slug: "/work/anesthesia-one",
    tags: ["Healthcare", "App & Web"],
    caption:
      "A physician came to us with a tool anesthesia professionals needed and no way to build it. We designed and developed the mobile app, rebuilt the web platform and created the brand, and stayed on to keep it current.",
    startDate: "01-01-2024",
    present: true,
    cardImg: {
      url: "/anesthesia-one/card.webp",
      alt: "AnesthesiaOne mobile app and web platform",
    },
    testimonial: {
      feedback:
        "A talented, motivated, professional team and has simply been a pleasure to work with",
      client: {
        name: "Dr. Sanjib Adhikary",
        role: "AnesthesiaOne",
      },
    },
  },
];

export const WORK_SECTION: IWork = {
  title: "Outcomes Over Deliverable",
  description:
    "The businesses we partner with aren't looking for websites, software, or branding in isolation. They're looking for growth, efficiency, credibility, and a stronger foundation for the future.",
  projects: PROJECTS,
};
