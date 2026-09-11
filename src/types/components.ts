import type { LinkProps } from "next/link";

export interface INavLink {
  label: string;
  href: LinkProps["href"];
}

export type ClassValue =
  string | number | null | undefined | false | ClassValue[] | { [key: string]: unknown };
