import { clientEnv } from "@/lib/env/client";
import type { BookingSource } from "@/types";

export const BOOKING = {
  path: "/book-a-call",
  calLink: clientEnv.NEXT_PUBLIC_CAL_LINK,
  namespace: "intro-call",
  brandColor: "#294f74",
  theme: "light",
  layout: "month_view",
} as const;

export const bookingHref = (source: BookingSource) => `${BOOKING.path}?source=${source}`;

export const buildBookingConfig = (params: Pick<URLSearchParams, "get">) => ({
  utm_source: params.get("utm_source") ?? "website",
  utm_medium: params.get("utm_medium") ?? "cta",
  utm_campaign: params.get("utm_campaign") ?? params.get("source") ?? "direct",
  utm_content: params.get("utm_content") ?? "book-a-call-page",
});
