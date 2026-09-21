import type { ImageProps } from "next/image";
import type { LinkProps } from "next/link";
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
  items: TrustedByItem[];
  stats: StatItem[];
}
