"use client";

import { useEffect, useState } from "react";

const THRESHOLD = 8;
const REVEAL_ABOVE = 80;

export const useHideOnScroll = () => {
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    let last = window.scrollY;
    let queued = false;
    let resync = false;

    const update = () => {
      queued = false;

      // The mobile menu locks scrolling by pinning <body> (position: fixed), which
      // snaps scrollY to 0, then restores it with scrollTo on close. Neither jump is
      // the user scrolling, so skip them and re-baseline on the first real reading.
      if (document.body.style.position === "fixed") {
        resync = true;
        return;
      }
      if (resync) {
        resync = false;
        last = window.scrollY;
        return;
      }

      // Clamp: iOS rubber-banding reports scrollY past both ends, and the
      // bounce back reads as a direction change the user never made.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.min(Math.max(window.scrollY, 0), Math.max(max, 0));

      const delta = y - last;
      // Below the threshold, leave `last` alone so small moves accumulate
      // instead of each one resetting the baseline.
      if (Math.abs(delta) < THRESHOLD) return;

      last = y;
      setHidden(delta > 0 && y > REVEAL_ABOVE);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
};
