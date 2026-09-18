"use client";

import { usePathname } from "next/navigation";

interface HideOnRoutesProps {
  routes: string[];
  children: React.ReactNode;
}

const HideOnRoutes: React.FC<HideOnRoutesProps> = ({ routes, children }) => {
  const pathname = usePathname();

  return routes.includes(pathname) ? null : children;
};

export default HideOnRoutes;
