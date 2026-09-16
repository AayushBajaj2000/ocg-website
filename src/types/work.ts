import { IImage } from "@/types";
import type { ImageProps } from "next/image";
import type { LinkProps } from "next/link";

export interface ITestimonial {
  feedback?: string;
  client?: {
    name?: string;
    role?: string;
    img?: IImage;
    logo?: IImage;
  };
}

export interface IProjectIntro {
  name?: string;
  description?: string;
  timeFrame?: string;
  roles?: string[];
  url?: ImageProps["src"];
}

export interface IProjectScope {
  scopes?: {
    title?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content?: any;
  }[];
  img?: IImage;
  stack?: IImage[];
  font?: {
    name?: string;
    source?: string;
    fallback?: string;
    variants?: { weight?: number; style?: string; file?: File | null }[];
  }[];
  sampleText?: string;
  colors?: {
    hex?: string;
    name?: string;
  }[];
  moreImgs?: IImage[];
}

export interface IProject {
  title?: string;
  caption?: string;
  startDate?: string;
  endDate?: string;
  present?: boolean;
  tags?: string[];
  slug?: LinkProps["href"];
  testimonial?: ITestimonial;
  cardImg?: IImage;
  heroImg?: IImage;
  intro?: IProjectIntro;
  scope?: IProjectScope;
}

export interface IWork {
  title: string;
  description: string;
  projects: IProject[];
}
