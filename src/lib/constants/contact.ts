import { IDiscoveryCall } from "@/types";

export const DISCOVERY: IDiscoveryCall = {
  heading: "Prefer to discuss your project on live call?",
  subheading: "Start with a 25-minute discovery session instead",
  host: { name: "Austin Page", role: "Co-founder and Dev Lead", avatar: "/avatars/austin.webp" },
  cta: { label: "Book a Discovery call", href: "/book-a-call" },
} as const;
