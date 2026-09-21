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
    /** Poster for the wallpaper video: the loop's first frame, so playback starts without a jump. */
    wallpaper: string;
    video: { sources: IHomeDesktopVideoSource[]; stillAt: number; playbackRate: number };
    /** Extra shortcut pinned top-right, only in full screen. */
    contact: IHomeDesktopIcon;
    icons: IHomeDesktopIcon[];
    /** The Projects folder. Its files are the case studies, so new ones appear on their own. */
    folder: {
      label: string;
      href: string;
      files: IHomeDesktopFile[];
      shortcuts: { label: string; href: string }[];
    };
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

/** A file inside a desktop folder; opens in the OS browser. */
export interface IHomeDesktopFile {
  name: string;
  href: string;
  kind?: string;
  img: { url: string; alt: string };
}

export interface IHomeDesktopVideoSource {
  src: string;
  type: string;
  /** Limits the source to matching viewports, e.g. the lighter encode for phones. */
  media?: string;
}

/** A seated figure in the wallpaper, placed as a percentage of the image's width. */
export interface IHomeDesktopPerson {
  name: string;
  x: number;
}
