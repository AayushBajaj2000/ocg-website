"use client";

import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from "react";

const GAP = 8;

const VIEWPORT_PADDING = 12;

const MIN_WIDTH = 288;

const MAX_WIDTH = 360;

type Position = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

type Options = {
  isOpen: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
};

export const useAnchoredPosition = ({ isOpen, anchorRef, panelRef }: Options): Position | null => {
  const [position, setPosition] = useState<Position | null>(null);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const anchorRect = anchor.getBoundingClientRect();
    const panelHeight = panelRef.current?.offsetHeight ?? 0;
    const width = Math.min(Math.max(anchorRect.width, MIN_WIDTH), MAX_WIDTH);

    const spaceBelow = window.innerHeight - anchorRect.bottom - GAP - VIEWPORT_PADDING;
    const spaceAbove = anchorRect.top - GAP - VIEWPORT_PADDING;
    const placeAbove = panelHeight > spaceBelow && spaceAbove > spaceBelow;

    const maxHeight = window.innerHeight - VIEWPORT_PADDING * 2;
    const height = Math.min(panelHeight, maxHeight);
    const preferredTop = placeAbove ? anchorRect.top - GAP - height : anchorRect.bottom + GAP;
    const maxTop = window.innerHeight - height - VIEWPORT_PADDING;
    const top = Math.max(VIEWPORT_PADDING, Math.min(preferredTop, maxTop));

    const maxLeft = window.innerWidth - width - VIEWPORT_PADDING;
    const left = Math.max(VIEWPORT_PADDING, Math.min(anchorRect.left, maxLeft));

    setPosition({ top, left, width, maxHeight });
  }, [anchorRef, panelRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    update();
  }, [isOpen, update]);

  useEffect(() => {
    if (!isOpen) return;

    const onChange = () => update();

    window.addEventListener("resize", onChange);

    return () => window.removeEventListener("resize", onChange);
  }, [isOpen, update]);

  return position;
};
