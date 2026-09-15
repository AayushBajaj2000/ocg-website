"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { useScrollLock } from "@/components/layout/hooks/useScrollLock";
import { DESKTOP_MEDIA_QUERY } from "@/lib/constants";

type HeaderDropdown = {
  isOpen: boolean;
  close: () => void;
  toggle: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export const useHeaderDropdown = (): HeaderDropdown => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [renderedAt, setRenderedAt] = useState(pathname);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((previous) => !previous), []);

  if (pathname !== renderedAt) {
    setRenderedAt(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent) => !event.matches && setIsOpen(false);

    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && containerRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && containerRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [isOpen]);

  useScrollLock(isOpen);

  return { isOpen, close, toggle, containerRef, triggerRef };
};
