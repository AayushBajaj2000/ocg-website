import { bookingHref } from "@/lib/constants";
import { IDiscoveryCall } from "@/types";

export const DISCOVERY: IDiscoveryCall = {
  heading: "Prefer to discuss your project on live call?",
  subheading: "Start with a 25-minute discovery session instead",
  host: {
    name: "Austin Page",
    role: "Co-founder and Dev Lead",
    avatar: "/avatars/austin-page.webp",
  },
  cta: { label: "Book a Discovery call", href: bookingHref("contact") },
} as const;
