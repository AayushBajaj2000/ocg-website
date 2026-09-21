import "server-only";
import { sanityFetch } from "@/lib/sanity/client";
import { toSanityImage } from "@/lib/sanity/image";
import { CUSTOMER_TESTIMONIALS_QUERY } from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/constants/sanity";
import { TRUSTED_BY_SECTION } from "@/lib/constants/trustedBy";
import type { ITrustedByClient, SanityCustomerTestimonial, TrustedByItem } from "@/types";

// A tile is a logo, so an entry without one (or without its drawn size) is left out.
const normalizeClient = ({
  id,
  company,
  logo,
  customerName,
  customerPosition,
  testimonial,
  photo,
}: SanityCustomerTestimonial): ITrustedByClient[] => {
  if (!logo?.width || !logo.height) return [];

  const name = customerName?.trim();
  const feedback = testimonial?.trim();
  const img = toSanityImage(photo);

  return [
    {
      _type: "client",
      _key: id,
      logo: {
        url: logo.url,
        alt: logo.altText || company?.trim() || "",
        width: logo.width,
        height: logo.height,
      },
      // Half a testimonial (a quote nobody said, or a name with nothing to say) stays hidden.
      testimonial:
        name && feedback
          ? {
              feedback,
              client: {
                name,
                role: [customerPosition?.trim(), company?.trim()].filter(Boolean).join(", "),
                img: img && { ...img, alt: img.alt || name },
              },
            }
          : undefined,
    },
  ];
};

/** Queries Sanity directly. Cached by Next's data cache for the content ISR window. */
export const fetchTrustedByItems = async (): Promise<TrustedByItem[]> => {
  const customers = await sanityFetch<SanityCustomerTestimonial[]>(
    CUSTOMER_TESTIMONIALS_QUERY,
    SANITY_CACHE_TAGS.customerTestimonials,
  );
  const items: TrustedByItem[] = customers.flatMap(normalizeClient);
  items.splice(Math.min(TRUSTED_BY_SECTION.ctaIndex, items.length), 0, TRUSTED_BY_SECTION.cta);
  return items;
};
