"use client";

import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from "react";

export type LineBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Span = { top: number; bottom: number; left: number; right: number };

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const isRendered = (element: HTMLElement) => element.getClientRects().length > 0;

const resolveLineHeight = (element: HTMLElement) => {
  const { lineHeight, fontSize } = getComputedStyle(element);
  const resolved = Number.parseFloat(lineHeight);

  return Number.isFinite(resolved) ? resolved : Number.parseFloat(fontSize) * 1.2;
};

const collectSpans = (element: HTMLElement): Span[] => {
  const range = document.createRange();
  range.selectNodeContents(element);

  const rects = Array.from(range.getClientRects())
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .sort((a, b) => a.top - b.top || a.left - b.left);

  return rects.reduce<Span[]>((spans, rect) => {
    const current = spans.at(-1);
    const center = (rect.top + rect.bottom) / 2;

    if (current && center > current.top && center < current.bottom) {
      current.top = Math.min(current.top, rect.top);
      current.bottom = Math.max(current.bottom, rect.bottom);
      current.left = Math.min(current.left, rect.left);
      current.right = Math.max(current.right, rect.right);
    } else {
      spans.push({ top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right });
    }

    return spans;
  }, []);
};

const sameBoxes = (a: LineBox[] | null, b: LineBox[]) =>
  a?.length === b.length &&
  a.every((box, index) => {
    const next = b[index];

    return (
      Math.abs(box.top - next.top) < 0.5 &&
      Math.abs(box.left - next.left) < 0.5 &&
      Math.abs(box.width - next.width) < 0.5 &&
      Math.abs(box.height - next.height) < 0.5
    );
  });

const sameLines = (a: string[] | null, b: string[]) =>
  a?.length === b.length && a.every((line, index) => line === b[index]);

const useTrackedMeasure = (
  ref: RefObject<HTMLElement | null>,
  measure: () => void,
  enabled: boolean,
) => {
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!enabled || !element) return;

    let frame = 0;
    let cancelled = false;

    const schedule = () => {
      if (cancelled) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();

    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    document.fonts?.ready.then(schedule).catch(() => undefined);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ref, measure, enabled]);
};

export const useLineBoxes = (
  textRef: RefObject<HTMLElement | null>,
  originRef: RefObject<HTMLElement | null>,
  enabled = true,
) => {
  const [boxes, setBoxes] = useState<LineBox[] | null>(null);

  const measure = useCallback(() => {
    const text = textRef.current;
    const origin = originRef.current;

    if (!text || !origin || !isRendered(text)) return;

    const originRect = origin.getBoundingClientRect();
    const lineHeight = resolveLineHeight(text);

    const next = collectSpans(text).map((span) => {
      const height = Math.max(span.bottom - span.top, lineHeight);
      const center = (span.top + span.bottom) / 2;

      return {
        top: center - height / 2 - originRect.top,
        left: span.left - originRect.left,
        width: span.right - span.left,
        height,
      };
    });

    setBoxes((previous) => (sameBoxes(previous, next) ? previous : next));
  }, [textRef, originRef]);

  useTrackedMeasure(textRef, measure, enabled);

  return boxes;
};

export const useLineSplit = (ref: RefObject<HTMLElement | null>, text: string, enabled = true) => {
  const [lines, setLines] = useState<string[] | null>(null);

  const measure = useCallback(() => {
    const element = ref.current;

    if (!element || !isRendered(element)) return;

    const node = element.firstChild;

    if (node?.nodeType !== Node.TEXT_NODE) return;

    const source = node.textContent ?? text;
    const range = document.createRange();
    const next: string[] = [];
    let currentTop: number | null = null;

    for (const match of source.matchAll(/\S+/g)) {
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);

      const { top } = range.getBoundingClientRect();

      if (currentTop !== null && Math.abs(top - currentTop) <= 1) {
        next[next.length - 1] += ` ${match[0]}`;
      } else {
        next.push(match[0]);
        currentTop = top;
      }
    }

    if (next.length === 0) return;

    setLines((previous) => (sameLines(previous, next) ? previous : next));
  }, [ref, text]);

  useTrackedMeasure(ref, measure, enabled && text.length > 0);

  return lines;
};
