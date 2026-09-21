"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import type { MouseEvent } from "react";
import { useDesktopMode } from "@/app/_components/desktop-hero/DesktopMode";
import DesktopWindowLights from "@/app/_components/desktop-hero/DesktopWindowLights";
import { WINDOW_FOCUS_RING } from "@/app/_components/desktop-hero/desktopStyles";
import type { IHomeDesktopFile } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

type Shortcut = { label: string; href: string };

type Props = {
  title: string;
  files: IHomeDesktopFile[];
  /** Sidebar links; each opens in the OS browser. */
  shortcuts: Shortcut[];
};

const isPlainClick = (event: MouseEvent) =>
  !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0);

const FinderWindow: React.FC<Props> = ({ title, files, shortcuts }) => {
  const { open, closeFinder } = useDesktopMode();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => closeRef.current?.focus(), []);

  // Real links throughout: a plain click opens the OS browser, anything else behaves natively.
  const openInBrowser = (page: { href: string; title: string }) => (event: MouseEvent) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    open(page);
  };

  return (
    <div
      role="dialog"
      aria-label={`${title} — folder`}
      className="flex size-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_80px_rgb(0_0_0/0.45)] ring-1 ring-black/15"
    >
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-44 shrink-0 flex-col bg-[#e9e9eb]/95 sm:flex">
          <div className="h-11 pl-3">
            <DesktopWindowLights onClose={closeFinder} closeRef={closeRef} />
          </div>
          <p className="px-4 pt-1 pb-1 text-[11px] font-medium text-black/40">Favourites</p>
          <ul className="flex flex-col gap-px px-2 text-[13px] text-[#1f1f1f]">
            <li className="rounded-md bg-black/10 px-2 py-1" aria-current="true">
              {title}
            </li>
            {shortcuts.map((shortcut) => (
              <li key={shortcut.href}>
                <Link
                  href={shortcut.href}
                  onClick={openInBrowser({ href: shortcut.href, title: shortcut.label })}
                  className={`block rounded-md px-2 py-1 hover:bg-black/5 ${WINDOW_FOCUS_RING}`}
                >
                  {shortcut.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-11 shrink-0 items-center gap-3 border-b border-black/10 px-3">
            <div className="h-full sm:hidden">
              <DesktopWindowLights onClose={closeFinder} closeRef={closeRef} />
            </div>
            <h2 className="text-[13px] font-semibold text-[#1f1f1f]">{title}</h2>
          </div>

          <ul className="grid min-h-0 flex-1 auto-rows-min grid-cols-2 content-start gap-x-3 gap-y-5 overflow-y-auto p-4 md:grid-cols-3 md:p-6 xl:grid-cols-4">
            {files.map((file) => (
              <li key={file.href}>
                <Link
                  href={file.href}
                  onClick={openInBrowser({ href: file.href, title: file.name })}
                  className={`group/file flex flex-col items-center gap-2 rounded-lg p-2 text-center hover:bg-[#1a73e8]/8 ${WINDOW_FOCUS_RING}`}
                >
                  <span className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-[#f2f2f4] shadow-sm ring-1 ring-black/10">
                    <Image
                      src={file.img.url}
                      alt={file.img.alt}
                      fill
                      sizes="(min-width: 1280px) 220px, (min-width: 768px) 28vw, 45vw"
                      className="object-cover transition-transform duration-300 group-hover/file:scale-103"
                    />
                  </span>
                  <span className="max-w-full truncate rounded-sm px-1.5 text-xs font-medium text-[#1f1f1f] group-hover/file:bg-[#1a73e8] group-hover/file:text-white">
                    {file.name}
                  </span>
                  {file.kind && (
                    <span className="-mt-1.5 text-[11px] text-black/45">{file.kind}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <p className="shrink-0 border-t border-black/10 py-1.5 text-center text-[11px] text-black/45">
            {files.length} {files.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </div>
  );
};

/** The OS's file manager: opens from the Projects folder and lists every case study. */
const DesktopFinder: React.FC<Props> = (props) => {
  const { isFinderOpen } = useDesktopMode();
  const reduced = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isFinderOpen && (
          <m.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: EASE, delay: reduced ? 0 : 0.2 }}
            className="absolute inset-x-2 top-11 bottom-16 z-10 md:inset-x-16 md:top-20 md:bottom-24 lg:right-64 lg:left-44"
          >
            <FinderWindow {...props} />
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default DesktopFinder;
