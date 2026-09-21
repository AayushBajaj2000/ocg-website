"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";

export type DesktopWindow = { href: string; title: string };

type DesktopModeContext = {
  isFull: boolean;
  /** The page open in the OS browser, if any. */
  browser: DesktopWindow | null;
  toggle: () => void;
  exit: () => void;
  /** Opens a page in the OS browser, extending the desktop to full screen to make room. */
  open: (page: DesktopWindow) => void;
  close: () => void;
};

const Context = createContext<DesktopModeContext | null>(null);

export const useDesktopMode = (): DesktopModeContext => {
  const value = use(Context);
  if (!value) throw new Error("useDesktopMode must be used inside <DesktopModeProvider>");
  return value;
};

/** Tracks whether the home OS desktop is docked in the hero or extended to full screen. */
export const DesktopModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFull, setIsFull] = useState(false);
  const [browser, setBrowser] = useState<DesktopWindow | null>(null);

  const exit = useCallback(() => {
    setIsFull(false);
    setBrowser(null);
  }, []);
  const toggle = useCallback(() => {
    setIsFull((prev) => !prev);
    setBrowser(null);
  }, []);
  const open = useCallback((page: DesktopWindow) => {
    setIsFull(true);
    setBrowser(page);
  }, []);
  const close = useCallback(() => setBrowser(null), []);

  const value = useMemo(
    () => ({ isFull, browser, toggle, exit, open, close }),
    [isFull, browser, toggle, exit, open, close],
  );

  return <Context value={value}>{children}</Context>;
};

export const DesktopModeButton: React.FC<
  Omit<ComponentPropsWithoutRef<"button">, "onClick" | "type">
> = (props) => {
  const { isFull, toggle } = useDesktopMode();
  return <button type="button" aria-pressed={isFull} onClick={toggle} {...props} />;
};

/** Swaps a label depending on the mode, e.g. "Switch to Desktop" / "Exit Desktop". */
export const DesktopModeLabel: React.FC<{ docked: string; full: string }> = ({ docked, full }) => {
  const { isFull } = useDesktopMode();
  return isFull ? full : docked;
};

type DesktopLinkProps = { href: string; title: string; className?: string; children: ReactNode };

/**
 * A desktop shortcut. It stays a real link (crawlable, works without JS, honours
 * cmd/ctrl/middle-click), but a plain click opens the page in the OS browser instead.
 */
export const DesktopLink: React.FC<DesktopLinkProps> = ({ href, title, className, children }) => {
  const { open } = useDesktopMode();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    event.preventDefault();
    open({ href, title });
  };

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
};
