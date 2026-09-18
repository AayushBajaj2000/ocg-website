import type { LinkProps } from "next/link";

export interface IHomeHero {
  title: string;
  description: string;
  cta: {
    label: string;
    href: LinkProps["href"];
  };
}

export interface IHomeHeading {
  eyebrow: string;
  title: string;
  description: string;
}

export interface IHome {
  hero: IHomeHero;
  services: IHomeHeading;
  work: IHomeHeading;
}
