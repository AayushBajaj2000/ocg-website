"use client";

import Link from "next/link";
import type { CSSProperties, PointerEvent, ReactNode } from "react";

type ButtonVariant = "book-call";

type FillStyle = CSSProperties & Record<"--icon-color" | "--icon-contrast", string>;

type ButtonProps = {
  href: string;
  variant: ButtonVariant;
  children?: ReactNode;
  "aria-label"?: string;
  className?: string;
  /** Text color inside the hover fill. Any CSS color, e.g. "white", "#131313", "var(--color-black-1)". */
  hoverTextColor?: string;
  target?: string;
  rel?: string;
};

// Shared by every variant: a direction-aware circular fill. A filled copy of the content (blue
// background, white text) sits on top, clipped to a circle. The circle grows from where the pointer
// entered (--x/--y) and, on leave, shrinks while its center glides to where the pointer exited.
// Because the text lives inside the clipped layer, it turns white exactly along the wipe edge.
// 150% radius covers the whole button even when entering from a corner.
const baseClasses =
  "group relative isolate overflow-hidden data-active:[--r:150%] focus-visible:[--r:150%]";

const fillClasses = [
  "pointer-events-none absolute inset-0 flex items-center justify-center gap-[inherit] bg-brand-blue",
  "[clip-path:circle(var(--r,0%)_at_var(--x,50%)_var(--y,50%))]",
  // Slingshot easing: a brief pull-back (negative y1), a fast launch, then a long soft settle.
  "transition-[clip-path] duration-900 ease-[cubic-bezier(0.55,-0.2,0.15,1)]",
  "group-data-snap:transition-none motion-reduce:transition-none",
].join(" ");

const variantClasses: Record<ButtonVariant, string> = {
  "book-call":
    "w-full h-11 bg-white flex items-center justify-center gap-2 text-black font-switzer text-sm",
};

// CSS can't read the pointer position, so this is the only JS: store it as CSS variables.
function setPoint(e: PointerEvent<HTMLAnchorElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

function onEnter(e: PointerEvent<HTMLAnchorElement>) {
  const el = e.currentTarget;
  // Move the collapsed circle to the entry point without animating, then grow it from there.
  el.dataset.snap = "";
  setPoint(e);
  void el.offsetWidth;
  delete el.dataset.snap;
  el.dataset.active = "";
}

function onLeave(e: PointerEvent<HTMLAnchorElement>) {
  setPoint(e);
  delete e.currentTarget.dataset.active;
}

export function Button({
  href,
  variant = "book-call",
  children,
  className = "",
  hoverTextColor = "white",
  ...rest
}: ButtonProps) {
  const fillStyle: FillStyle = {
    color: hoverTextColor,
    "--icon-color": hoverTextColor,
    "--icon-contrast": "var(--color-brand-blue)",
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      {...rest}
    >
      {children}
      <span aria-hidden="true" className={fillClasses} style={fillStyle}>
        {children}
      </span>
    </Link>
  );
}
