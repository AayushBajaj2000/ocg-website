import "server-only";
import { sanityFetch } from "@/lib/sanity/client";
import { TESTIMONIALS_QUERY } from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/constants/sanity";
import type { ITestimonialCard, SanityTestimonial } from "@/types";

const toImage = ({ photo, logo, customerName, company }: SanityTestimonial) => {
  if (photo) return { kind: "photo" as const, url: photo.url, alt: photo.altText || customerName };
  if (!logo?.width || !logo.height) return undefined;
  return {
    kind: "logo" as const,
    url: logo.url,
    alt: logo.altText || company?.trim() || "",
    width: logo.width,
    height: logo.height,
  };
};

const normalizeTestimonial = (testimonial: SanityTestimonial): ITestimonialCard => ({
  id: testimonial.id,
  feedback: testimonial.testimonial.trim(),
  client: {
    name: testimonial.customerName.trim(),
    role: [testimonial.customerPosition?.trim(), testimonial.company?.trim()]
      .filter(Boolean)
      .join(", "),
    img: toImage(testimonial),
  },
  metrics: testimonial.metrics.flatMap(({ value, label }) =>
    value?.trim() ? [{ value: value.trim(), label: label?.trim() || undefined }] : [],
  ),
});

/** Queries Sanity directly. Cached by Next's data cache for the content ISR window. */
export const fetchTestimonials = async (): Promise<ITestimonialCard[]> => {
  const testimonials = await sanityFetch<SanityTestimonial[]>(
    TESTIMONIALS_QUERY,
    SANITY_CACHE_TAGS.customerTestimonials,
  );
  return testimonials.map(normalizeTestimonial);
};
