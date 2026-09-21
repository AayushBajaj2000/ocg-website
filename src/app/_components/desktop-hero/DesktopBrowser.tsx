"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useDesktopMode } from "@/app/_components/desktop-hero/DesktopMode";
import DesktopWindowLights from "@/app/_components/desktop-hero/DesktopWindowLights";
import type { DesktopWindow } from "@/app/_components/desktop-hero/DesktopMode";

const HOST = "opencoregroup.com";
const EASE = [0.22, 1, 0.36, 1] as const;

const TOOL =
  "grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-[#474747] outline-none hover:bg-black/8 focus-visible:ring-2 focus-visible:ring-[#1a73e8]";

const Glyph: React.FC<{ d: string }> = ({ d }) => (
  <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-none stroke-current stroke-[1.6]">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BrowserWindow: React.FC<{ page: DesktopWindow }> = ({ page }) => {
  const { close } = useDesktopMode();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // What the framed page reports once loaded, so the tab and omnibox follow in-page navigation.
  const [current, setCurrent] = useState({ title: page.title, path: page.href });

  useEffect(() => closeRef.current?.focus(), []);

  const frameWindow = () => frameRef.current?.contentWindow ?? null;

  const onLoad = () => {
    setIsLoading(false);
    try {
      const win = frameWindow();
      if (!win) return;
      setCurrent({
        title: win.document.title || page.title,
        path: `${win.location.pathname}${win.location.search}`,
      });
    } catch {
      // Navigated somewhere cross-origin: keep showing the last known page.
    }
  };

  const reload = () => {
    setIsLoading(true);
    try {
      frameWindow()?.location.reload();
    } catch {
      if (frameRef.current) frameRef.current.src = page.href;
    }
  };

  const go = (delta: -1 | 1) => {
    try {
      frameWindow()?.history.go(delta);
    } catch {
      // Cross-origin history is off limits; nothing to do.
    }
  };

  return (
    <div
      role="dialog"
      aria-label={`${current.title} — browser window`}
      className="flex size-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_80px_rgb(0_0_0/0.45)] ring-1 ring-black/15"
    >
      <div className="flex h-10 shrink-0 items-end gap-2 bg-[#dee1e6] pr-2 pl-3">
        <DesktopWindowLights onClose={close} closeRef={closeRef} />
        <div className="flex h-8 max-w-60 min-w-0 flex-1 items-center gap-2 rounded-t-lg bg-white px-3">
          <Image src="/logo-mob.svg" alt="" width={14} height={14} className="size-3.5 shrink-0" />
          <span className="truncate text-xs text-[#1f1f1f]">{current.title}</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close tab"
            className="ml-auto grid size-4 shrink-0 cursor-pointer place-items-center rounded-full text-[#474747] outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-[#1a73e8]"
          >
            <Glyph d="M4.5 4.5l7 7m0-7l-7 7" />
          </button>
        </div>
      </div>

      <div className="relative flex h-10 shrink-0 items-center gap-1 border-b border-black/10 bg-white px-2">
        <button type="button" onClick={() => go(-1)} aria-label="Back" className={TOOL}>
          <Glyph d="M9.5 3.5L5 8l4.5 4.5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Forward"
          className={`${TOOL} max-sm:hidden`}
        >
          <Glyph d="M6.5 3.5L11 8l-4.5 4.5" />
        </button>
        <button type="button" onClick={reload} aria-label="Reload" className={TOOL}>
          <Glyph d="M12.5 8a4.5 4.5 0 1 1-1.4-3.26M12.5 2.75V5h-2.25" />
        </button>
        <div className="mx-1 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#eff1f3] px-3 text-xs">
          <Glyph d="M5 7V5.5a3 3 0 0 1 6 0V7m-7 0h8v6H4z" />
          <span className="truncate text-[#1f1f1f]">
            {HOST}
            <span className="text-[#5f6368]">{current.path === "/" ? "" : current.path}</span>
          </span>
        </div>
        {/* The real navigation, for anyone who would rather leave the OS. */}
        <a href={current.path} aria-label="Open this page outside the desktop" className={TOOL}>
          <Glyph d="M9 3h4v4m0-4L7.5 8.5M6 4H3.5v8.5H12V10" />
        </a>
        {isLoading && (
          <span className="desktop-browser-progress absolute inset-x-0 -bottom-px h-0.5 bg-[#1a73e8]" />
        )}
      </div>

      <iframe
        ref={frameRef}
        src={page.href}
        title={current.title}
        onLoad={onLoad}
        className="min-h-0 w-full flex-1 bg-white"
      />
    </div>
  );
};

/** The OS's browser: opens the page behind a desktop shortcut in a window over the wallpaper. */
const DesktopBrowser: React.FC = () => {
  const { browser } = useDesktopMode();
  const reduced = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {browser && (
          <m.div
            // A different shortcut is a different window, not the same iframe re-pointed.
            key={browser.href}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: EASE, delay: reduced ? 0 : 0.2 }}
            className="absolute inset-x-2 top-11 bottom-2 z-20 md:inset-x-8 md:top-14 md:bottom-6 lg:inset-x-36"
          >
            <BrowserWindow page={browser} />
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default DesktopBrowser;
