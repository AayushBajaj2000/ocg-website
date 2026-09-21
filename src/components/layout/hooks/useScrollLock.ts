"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

export const useScrollLock = (isLocked: boolean): void => {
  const lenis = useLenis();

  useEffect(() => {
    if (!isLocked) return;

    // Pause smooth scrolling too: it would keep easing toward its last target while the body
    // is pinned, then fight the restore below. `start()` re-reads the real position.
    lenis?.stop();

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
      lenis?.start();
    };
  }, [isLocked, lenis]);
};
