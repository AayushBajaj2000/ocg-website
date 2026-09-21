"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useDesktopMode } from "@/app/_components/desktop-hero/DesktopMode";
import { useScrollLock } from "@/components/layout/hooks/useScrollLock";
import { cn } from "@/lib/utils";

const DURATION = 550;
const EASING = "cubic-bezier(.83,0,.17,1)";

type Box = { top: number; left: number; width: number; height: number };

const toBox = ({ top, left, width, height }: DOMRect): Box => ({ top, left, width, height });
const viewportBox = (): Box => ({
  top: 0,
  left: 0,
  width: window.innerWidth,
  height: window.innerHeight,
});

const place = (el: HTMLElement, box: Box) =>
  Object.assign(el.style, {
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
  });

type Props = {
  /** Sizes the docked desktop. The slot keeps this space while the desktop is extended. */
  className?: string;
  children: ReactNode;
};

/**
 * The OS "screen". Docked, it fills its slot in the hero. Extended, it lifts out of the
 * page and grows from that exact spot to cover the viewport (and shrinks back on exit),
 * re-laying out every frame so the wallpaper and its hotspots never stretch.
 */
const DesktopShell: React.FC<Props> = ({ className, children }) => {
  const { isFull, browser, exit, close } = useDesktopMode();
  const slotRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const wasFull = useRef(false);

  useScrollLock(isFull);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    const screen = screenRef.current;
    if (!slot || !screen || wasFull.current === isFull) return;
    wasFull.current = isFull;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const docked = toBox(slot.getBoundingClientRect());
    const [from, to] = isFull ? [docked, viewportBox()] : [viewportBox(), docked];

    const settle = () => {
      screen.style.transition = "";
      if (isFull) {
        // Hand sizing back to CSS so the screen tracks viewport resizes.
        Object.assign(screen.style, { top: "0", left: "0", width: "100vw", height: "100dvh" });
      } else {
        screen.removeAttribute("style");
      }
    };

    Object.assign(screen.style, { position: "fixed", zIndex: "1000", transition: "none" });
    if (reduced) return settle();

    place(screen, from);
    // Commit the starting box before transitioning away from it.
    void screen.offsetWidth;
    screen.style.transition = ["top", "left", "width", "height"]
      .map((property) => `${property} ${DURATION}ms ${EASING}`)
      .join(", ");
    place(screen, to);

    const timer = window.setTimeout(settle, DURATION + 50);
    return () => window.clearTimeout(timer);
  }, [isFull]);

  useEffect(() => {
    if (!isFull) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Escape peels one layer at a time: the browser window first, then full screen.
      if (browser) close();
      else exit();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFull, browser, exit, close]);

  return (
    <div ref={slotRef} className={cn("relative", className)}>
      <div
        ref={screenRef}
        data-full={isFull}
        className="desktop-hero group/desktop border-hairline relative isolate size-full overflow-hidden border-b data-[full=true]:border-b-0"
      >
        {children}
      </div>
    </div>
  );
};

export default DesktopShell;
