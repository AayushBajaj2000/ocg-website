import { bookingHref } from "@/lib/constants";
import { IDiscoveryCall } from "@/types";

// wa.me link for the "Chat on WhatsApp" button: +1 (647) 493-2673. The button is hidden when this
// is empty, rather than pointing somewhere that isn't WhatsApp.
export const WHATSAPP_HREF = "https://wa.me/16474932673";

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
