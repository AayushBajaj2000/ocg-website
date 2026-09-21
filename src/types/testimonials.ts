import { IImage } from "@/types";
import type { SanityImageAsset } from "@/types/sanity";

export interface ITestimonialMetric {
  value: string;
  label?: string;
}

export interface ITestimonialCard {
  id: string;
  feedback: string;
  client: {
    name: string;
    role: string;
    /** The customer's photo when there is one, otherwise their company logo. */
    img?: IImage & { kind: "photo" | "logo"; width?: number; height?: number };
  };
  /** Results from the customer's case study; a card without any simply shows none. */
  metrics: ITestimonialMetric[];
}

/** Raw shape returned by `TESTIMONIALS_QUERY`, before normalization. */
export interface SanityTestimonial {
  id: string;
  company: string | null;
  customerName: string;
  customerPosition: string | null;
  testimonial: string;
  photo: SanityImageAsset | null;
  logo: SanityImageAsset | null;
  metrics: Array<{ value: string | null; label: string | null }>;
}

export interface ITestimonials {
  title?: string;
  description?: string;
}
