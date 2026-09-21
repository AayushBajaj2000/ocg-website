"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Pins a full-screen sheet to the *visual* viewport on phones.
 *
 * iOS Safari doesn't resize the layout viewport when the keyboard opens: it shrinks the visual
 * viewport and scrolls the page to keep the input in view. A `position: fixed; inset: 0` sheet
 * is laid out against the layout viewport, so it ends up taller than the visible area and
 * shifted, with the page behind it showing in the gap. Tracking `window.visualViewport` and
 * writing its height and offset onto the sheet keeps it covering exactly what the visitor sees.
 *
 * Writes `--vv-height` / `--vv-top` straight to the element rather than through React state:
 * the keyboard animation fires these events every frame.
 */
export const useVisualViewport = (
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onChange?: () => void,
): void => {
  useEffect(() => {
    const viewport = window.visualViewport;
    const element = ref.current;
    if (!isActive || !viewport || !element) return;

    const sync = () => {
      element.style.setProperty("--vv-height", `${viewport.height}px`);
      element.style.setProperty("--vv-top", `${viewport.offsetTop}px`);
      onChange?.();
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      element.style.removeProperty("--vv-height");
      element.style.removeProperty("--vv-top");
    };
  }, [ref, isActive, onChange]);
};
