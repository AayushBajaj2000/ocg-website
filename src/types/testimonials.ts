import { IImage } from "@/types";

export interface ITestimonialMetric {
  value: string;
  label?: string;
}

export interface ITestimonialCard {
  feedback: string;
  rating: number;
  client: {
    name: string;
    role: string;
    logo: IImage;
  };
  metrics: ITestimonialMetric[];
}

export interface ITestimonials {
  title?: string;
  description?: string;
  testimonials?: ITestimonialCard[];
}
