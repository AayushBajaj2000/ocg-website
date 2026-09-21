"use client";

import "lenis/dist/lenis.css";
import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
};

/**
 * Eased wheel scrolling for the whole site. Lenis animates the real document scroll rather than
 * faking one with transforms, so `position: sticky`, the hide-on-scroll header, in-view reveals
 * and the browser's own find/anchor behaviour all keep working.
 */
const SmoothScrollProvider: React.FC<Props> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  // Someone who asked their OS for less motion gets the browser's native scroll. The provider
  // still renders, with easing switched off: returning bare children here instead would remount
  // the whole page when the preference resolves after hydration.
  const isSmooth = !prefersReducedMotion;

  return (
    <ReactLenis
      root
      options={{
        // How quickly the page catches up with the wheel: lower is floatier. 0.1 reads as
        // smooth without making the page feel late.
        lerp: 0.1,
        smoothWheel: isSmooth,
        // Touch screens already have momentum scrolling; leave it to the OS.
        syncTouch: false,
        // Scrollable panels (chat, Finder window, dialogs, the mobile menu) scroll themselves
        // instead of passing the wheel through to the page behind them.
        allowNestedScroll: true,
        // In-page #links glide instead of jumping.
        anchors: isSmooth,
        // A route change mid-glide would otherwise carry the old page's momentum into the new one.
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollProvider;
