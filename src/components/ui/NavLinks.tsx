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
        resolve(className, state),
        isActive ? activeClassName : inactiveClassName,
      )}
      {...rest}
    >
      {resolve(children, state)}
    </Link>
  );
};

const NavLinks: React.FC = () => {
  return (
    <>
      <div className="hidden items-center gap-10 lg:flex">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.label}
            href={link.href}
            prefetch={false}
            className="flex items-center gap-2"
            activeClassName="text-brand-blue"
            inactiveClassName="text-black-3"
          >
            <BulletIcon className="size-1.5" />
            {link.label}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default NavLinks;
