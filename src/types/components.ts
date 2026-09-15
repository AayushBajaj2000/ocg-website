import type { LinkProps } from "next/link";
import type { ReactNode } from "react";
import type { ImageProps } from "next/image";

export interface INavLinkDropdown {
  icon?: ReactNode;
  title?: string;
  description?: string;
  href?: LinkProps["href"];
}

export interface INavLink {
  label: string;
  href?: LinkProps["href"];
  isDropdown?: boolean;
  dropdownLinks?: INavLinkDropdown[];
  dropdownViewAll?: INavLinkDropdown;
}

export type INavLinkCardIcon = "file";

export interface INavLinkCard {
  href: LinkProps["href"];
  img: {
    url: ImageProps["src"];
    alt: ImageProps["alt"];
  };
  category?: string;
  headline?: {
    icon?: INavLinkCardIcon;
    text?: string;
  };
  title?: string;
  caption?: {
    authorName?: string;
    readTime?: string;
    text?: string;
  };
}

export type ClassValue =
  string | number | null | undefined | false | ClassValue[] | { [key: string]: unknown };

export interface IFaq {
  question: string;
  answer: string;
}

export type IFooterAiIconName = "perplexity" | "gemini" | "chatgpt" | "claude" | "grok";

export type IFooterSocialIconName = "linkedin" | "facebook" | "instagram" | "x";

export type IFooterIcons<K extends IFooterAiIconName | IFooterSocialIconName> = Record<
  K,
  ReactNode
>;

export interface IFooterLink {
  label?: string;
  name?: IFooterAiIconName | IFooterSocialIconName;
  href?: string;
}

export interface IFooterHeadingLink {
  label?: string;
  link?: IFooterLink;
}

export interface IFooterAiFooterLink {
  title?: string;
  links?: IFooterLink[];
}

export interface IFooterText {
  isLink?: boolean;
  text?: string;
  href?: string;
}

export type IFooter = {
  headingLinks?: IFooterHeadingLink[];
  aiFooterLinks?: IFooterAiFooterLink;
  links?: IFooterLink[];
  footerText?: IFooterText[];
  socialLinks?: IFooterLink[];
  footerImages?: string[] | ImageProps["src"][];
};
