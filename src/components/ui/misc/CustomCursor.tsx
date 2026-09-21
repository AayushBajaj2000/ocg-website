"use client";

import { useEffect, useRef } from "react";

// Anything the visitor can act on: the dot grows over these.
const INTERACTIVE =
  'a[href], button, summary, label, select, [role="button"], [role="link"], [role="tab"], [tabindex]:not([tabindex="-1"])';

// Where a text caret is the more useful cursor: the dot steps aside and the native I-beam shows.
const TEXT_ENTRY =
  'textarea, [contenteditable=""], [contenteditable="true"], input:not([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"], [type="range"], [type="file"], [type="color"])';

const ACTIVE_CLASS = "has-custom-cursor";

/**
 * Replaces the mouse cursor with the dot from the centre of the OpenCore mark.
 *
 * Only for a real mouse: touch and pen keep their native behaviour, and without JS nothing
 * changes at all, because the native cursor is only hidden once this has mounted.
 */
const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!dot || !finePointer.matches) return;

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;

    const hide = () => {
      dot.dataset.visible = "false";
    };

    const onMove = (event: PointerEvent) => {
      // A finger or stylus on a hybrid device: hand the screen back to the native cursor.
      if (event.pointerType !== "mouse") {
        root.classList.remove(ACTIVE_CLASS);
        hide();
        return;
      }

      root.classList.add(ACTIVE_CLASS);
      x = event.clientX;
      y = event.clientY;

      const target = event.target instanceof Element ? event.target : null;
      dot.dataset.visible = "true";
      dot.dataset.state = target?.closest(TEXT_ENTRY)
        ? "text"
        : target?.closest(INTERACTIVE)
          ? "hover"
          : "rest";

      // The dot tracks the pointer exactly (no easing): it is the cursor, so lag would make
      // every click feel off. One write per frame, however fast the events arrive.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        dot.style.translate = `${x}px ${y}px`;
      });
    };

    const onDown = () => (dot.dataset.pressed = "true");
    const onUp = () => (dot.dataset.pressed = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    // Leaving the page also covers entering an iframe (the OS browser, the booking embed),
    // where this document stops receiving pointer events and the dot would otherwise freeze.
    root.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove(ACTIVE_CLASS);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      data-visible="false"
      data-state="rest"
      className="custom-cursor"
    >
      {/* The inner dot of the logo mark, path and all (public/logo-mob.svg). */}
      <svg viewBox="9 8.83 8.73 8.69" className="custom-cursor-dot">
        <path d="M9.60352 13.1762C9.60352 10.4018 10.6276 9.43355 13.3648 9.43355C16.102 9.43355 17.1261 10.4018 17.1261 13.1762C17.1261 15.9506 16.102 16.9188 13.3648 16.9188C10.6276 16.9188 9.60352 15.9506 9.60352 13.1762Z" />
      </svg>
    </div>
  );
};

export default CustomCursor;
