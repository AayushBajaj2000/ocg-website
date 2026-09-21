import { bookingHref } from "@/lib/constants/booking";

export const ASSISTANT = {
  name: "OpenCore AI",
  launcherLabel: "Ask AI",
  greeting: "Hey, ask away.",
  placeholder: "Ask about OpenCore…",
  starters: [
    "What does OpenCore actually do?",
    "What kind of AI solutions can you build for my business?",
    "Show me a project you're proud of.",
    "How do I start working with you?",
  ],
  /** Keep in step with the byte ceiling in agent/channels/eve.ts. */
  maxMessageChars: 1500,
  disclaimer: "AI-generated, so it can be wrong. Please don't share sensitive details.",
  fallback: { label: "Book a call instead.", href: bookingHref("assistant") },
} as const;
