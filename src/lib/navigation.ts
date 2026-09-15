import type { LinkProps } from "next/link";
import type { INavLink } from "@/types";

export type NavLinkMatch = "exact" | "prefix";

type Href = LinkProps["href"];

export const normalizePathname = (pathname: string): string =>
  pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

export const toPathname = (href: Href): string | null => {
  const value = typeof href === "string" ? href : (href.pathname ?? "");
  if (!value.startsWith("/")) return null;
  return normalizePathname(value.split(/[?#]/, 1)[0] ?? value);
};

export const matchesPathname = (pathname: string, href: string, match: NavLinkMatch): boolean => {
  if (pathname === href) return true;
  if (match === "exact" || href === "/") return false;
  return pathname.startsWith(`${href}/`);
};

export const isHrefActive = (
  pathname: string | null,
  href: Href,
  match?: NavLinkMatch,
): boolean => {
  const target = toPathname(href);
  if (pathname === null || target === null) return false;
  return matchesPathname(
    normalizePathname(pathname),
    target,
    match ?? (target === "/" ? "exact" : "prefix"),
  );
};

export const getNavGroupHrefs = (link: INavLink): Href[] =>
  [...(link.dropdownLinks ?? []), link.dropdownViewAll]
    .map((item) => item?.href)
    .filter((href): href is Href => href !== undefined);
