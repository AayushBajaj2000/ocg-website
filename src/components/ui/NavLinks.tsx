"use client";

import type { ComponentProps, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BulletIcon } from "@/components/icons/BulletIcon";
import { NAV_LINKS } from "@/lib/constants";

export type NavLinkMatch = "exact" | "prefix";

type NavLinkRenderState = { isActive: boolean };

type NavLinkSlot<T> = T | ((state: NavLinkRenderState) => T);

type Props = Omit<ComponentProps<typeof Link>, "className" | "children"> & {
  className?: NavLinkSlot<string | undefined>;
  match?: NavLinkMatch;
  activeClassName?: string;
  inactiveClassName?: string;
  isActive?: (context: { href: string; pathname: string | null }) => boolean;
  children?: NavLinkSlot<ReactNode>;
};

const joinClassNames = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(" ");

const resolve = <T,>(slot: NavLinkSlot<T>, state: NavLinkRenderState): T =>
  typeof slot === "function" ? (slot as (state: NavLinkRenderState) => T)(state) : slot;

const normalize = (pathname: string) =>
  pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

const toPathname = (href: ComponentProps<typeof Link>["href"]): string | null => {
  const value = typeof href === "string" ? href : (href.pathname ?? "");
  if (!value.startsWith("/")) return null;
  return normalize(value.split(/[?#]/, 1)[0]!);
};

const matches = (pathname: string, href: string, match: NavLinkMatch) => {
  if (pathname === href) return true;
  if (match === "exact" || href === "/") return false;
  return pathname.startsWith(`${href}/`);
};

export const NavLink: React.FC<Props> = ({
  href,
  className = "flex items-center gap-2",
  match,
  activeClassName,
  inactiveClassName,
  isActive: isActiveOverride,
  children,
  ...rest
}) => {
  const pathname = usePathname();
  const target = toPathname(href);

  const isActive = isActiveOverride
    ? isActiveOverride({ href: typeof href === "string" ? href : (href.pathname ?? ""), pathname })
    : pathname !== null &&
      target !== null &&
      matches(normalize(pathname), target, match ?? (target === "/" ? "exact" : "prefix"));

  const state: NavLinkRenderState = { isActive };

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive || undefined}
      className={joinClassNames(
        "group flex items-center gap-2 overflow-hidden",
        resolve(className, state),
        isActive ? "text-brand-blue" : "text-black-3",
        isActive ? activeClassName : inactiveClassName,
      )}
      {...rest}
    >
      {/* Slide with transform, not margin: the link keeps its width, so neighbours never shift.
          Inactive, the row is nudged left by the bullet's width and clipped by the outer span.
          The clip lives on this span (not the link) so link padding can't leave room to show the bullet. */}
      <span className="flex min-w-0 overflow-hidden">
        <span
          className={`${isActive ? "translate-x-0" : "-translate-x-1.5"} flex min-w-0 items-center gap-2 transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none`}
        >
          <BulletIcon className="size-1.5 shrink-0" />
          {resolve(children, state)}
        </span>
      </span>
    </Link>
  );
};

const NavLinks: React.FC = () => {
  return (
    <>
      <div className="hidden items-center gap-10 lg:flex">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.label} href={link.href} prefetch={false}>
            {link.label}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default NavLinks;
