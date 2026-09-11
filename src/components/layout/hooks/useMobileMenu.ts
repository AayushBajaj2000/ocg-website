"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DESKTOP_QUERY = "(min-width: 64rem)";

type MobileMenu = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useMobileMenu = (): MobileMenu => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [renderedAt, setRenderedAt] = useState(pathname);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((previous) => !previous), []);

  if (pathname !== renderedAt) {
    setRenderedAt(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => event.matches && setIsOpen(false);

    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const { body, documentElement } = document;
    const offset = window.scrollY;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previousStyle = body.style.cssText;

    Object.assign(body.style, {
      position: "fixed",
      top: `-${offset}px`,
      left: "0",
      right: "0",
      paddingRight: scrollbar > 0 ? `${scrollbar}px` : "",
    });

    return () => {
      body.style.cssText = previousStyle;
      window.scrollTo(0, offset);
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle };
};
