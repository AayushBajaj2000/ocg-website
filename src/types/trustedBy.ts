import type { ImageProps } from "next/image";
import type { LinkProps } from "next/link";
import type { SanityImageAsset } from "@/types/sanity";
import type { ITestimonial } from "@/types/work";

export interface ITrustedByLogo {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface ITrustedByClient {
  _type: "client";
  _key: string;
  logo: ITrustedByLogo;
  testimonial?: ITestimonial;
}

export interface ITrustedByCta {
  _type: "cta";
  _key: string;
  label: string;
  linkLabel: string;
  href: LinkProps["href"];
}

export type TrustedByItem = ITrustedByClient | ITrustedByCta;

export interface IStatHighlight {
  _type: "highlight";
  _key: string;
  label: string;
  image: {
    url: ImageProps["src"];
    alt: string;
  };
}

export interface IStatMetric {
  _type: "metric";
  _key: string;
  label: string;
  value: number | string;
  suffix?: string;
  accent?: boolean;
}

export type StatItem = IStatHighlight | IStatMetric;

export interface ITrustedBy {
  title: string;
  /** Tile that invites the visitor to become the next logo; the client tiles come from Sanity. */
  cta: ITrustedByCta;
  /** Zero-based slot the CTA tile takes in the grid. */
  ctaIndex: number;
  stats: StatItem[];
}

/** Raw shape returned by `CUSTOMER_TESTIMONIALS_QUERY`, before normalization. */
export interface SanityCustomerTestimonial {
  id: string;
  company: string | null;
  logo: SanityImageAsset | null;
  customerName: string | null;
  customerPosition: string | null;
  testimonial: string | null;
  photo: SanityImageAsset | null;
}
