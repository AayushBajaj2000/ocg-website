"use client";

import type { ComponentProps, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavLinkLabel from "@/components/layout/header/NavLinkLabel";
import HeaderDropdown from "@/components/layout/header/HeaderDropdown";
import { NAV_LINKS } from "@/lib/constants";
import { isHrefActive, type NavLinkMatch } from "@/lib/navigation";

export type { NavLinkMatch };

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

  const isActive = isActiveOverride
    ? isActiveOverride({ href: typeof href === "string" ? href : (href.pathname ?? ""), pathname })
    : isHrefActive(pathname, href, match);

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
      <NavLinkLabel isActive={isActive}>{resolve(children, state)}</NavLinkLabel>
    </Link>
  );
};

const NavLinks: React.FC = () => (
  <div className="hidden items-center gap-10 lg:flex">
    {NAV_LINKS.map((link) =>
      link.isDropdown ? (
        <HeaderDropdown key={link.label} link={link} />
      ) : (
        link.href && (
          <NavLink key={link.label} href={link.href} prefetch={false}>
            {link.label}
          </NavLink>
        )
      ),
    )}
  </div>
);

export default NavLinks;
