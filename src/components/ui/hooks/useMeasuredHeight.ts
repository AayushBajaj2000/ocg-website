"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Measured<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  height: number | null;
};

export const useMeasuredHeight = <T extends HTMLElement>(): Measured<T> => {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const measured = entry?.borderBoxSize?.[0]?.blockSize ?? entry?.contentRect.height;
      if (measured !== undefined) setHeight(measured);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, height };
};
