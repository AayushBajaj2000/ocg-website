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
  desktop: {
    wallpaper: string;
    /** Extra shortcut pinned top-right, only in full screen. */
    contact: IHomeDesktopIcon;
    icons: IHomeDesktopIcon[];
    projects: IHomeDesktopIcon[];
    people: IHomeDesktopPerson[];
  };
  services: IHomeHeading;
  work: IHomeHeading;
}

export interface IHomeDesktopIcon {
  label: string;
  /** Shown instead of `label` while the desktop is extended to full screen. */
  fullLabel?: string;
  /** Omitted for the icon that extends the OS desktop to full screen. */
  href?: string;
  img: { url: string; alt: string; width: number; height: number };
}

/** A seated figure in the wallpaper, placed as a percentage of the image's width. */
export interface IHomeDesktopPerson {
  name: string;
  x: number;
}
