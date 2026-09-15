"use client";

import { usePathname } from "next/navigation";
import { getNavGroupHrefs, isHrefActive } from "@/lib/navigation";
import type { INavLink } from "@/types";

export const useIsNavGroupActive = (link: INavLink): boolean => {
  const pathname = usePathname();
  return getNavGroupHrefs(link).some((href) => isHrefActive(pathname, href, "prefix"));
};
