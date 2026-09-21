"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const isScrollable = (element: HTMLElement): boolean => {
  const { overflowY } = getComputedStyle(element);
  return (
    (overflowY === "auto" || overflowY === "scroll") && element.scrollHeight > element.clientHeight
  );
};

const findScrollRoot = (element: HTMLElement | null): HTMLElement | null => {
  let parent = element?.parentElement ?? null;

  while (parent) {
    if (isScrollable(parent)) return parent;
    parent = parent.parentElement;
  }

  return null;
};

export const useScrollRoot = (
  ref: RefObject<HTMLElement | null>,
  enabled = true,
): HTMLElement | null | undefined => {
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;
    setScrollRoot(findScrollRoot(ref.current));
  }, [enabled, ref]);

  return scrollRoot;
};
