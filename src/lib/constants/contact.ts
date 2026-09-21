import { bookingHref } from "@/lib/constants";
import { IDiscoveryCall } from "@/types";

// wa.me link for the "Chat on WhatsApp" button, e.g. "https://wa.me/16475550123". The button is
// hidden while this is empty, rather than pointing somewhere that isn't WhatsApp.
export const WHATSAPP_HREF = "";

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
