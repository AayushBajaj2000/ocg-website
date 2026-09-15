"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useScrollLock } from "@/components/layout/hooks/useScrollLock";
import { DESKTOP_MEDIA_QUERY } from "@/lib/constants";

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
    const desktop = window.matchMedia(DESKTOP_MEDIA_QUERY);
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

  useScrollLock(isOpen);

  return { isOpen, open, close, toggle };
};
