"use client";

import { useEffect } from "react";

export const useScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) return;

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
  }, [isLocked]);
};
