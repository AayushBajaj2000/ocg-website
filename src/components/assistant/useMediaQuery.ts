"use client";

import { useSyncExternalStore } from "react";

/** `false` on the server and on the first client render, then the live match. */
export const useMediaQuery = (query: string): boolean =>
  useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
