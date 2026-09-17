"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const TOKEN_TIMEOUT_MS = 30_000;

type Status = "idle" | "ready" | "error";

let scriptPromise: Promise<void> | null = null;

const loadScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");

    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Turnstile"));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
};

type Turnstile = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  status: Status;
  getToken: () => Promise<string>;
};

export const useTurnstile = (siteKey: string): Turnstile => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const pendingRef = useRef<((token: string | null) => void) | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;

    const settle = (token: string | null) => {
      pendingRef.current?.(token);
      pendingRef.current = null;
    };

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: "contact",
          execution: "execute",
          appearance: "interaction-only",
          theme: "light",
          callback: (token) => settle(token),
          "error-callback": () => settle(null),
          "expired-callback": () => settle(null),
          "timeout-callback": () => settle(null),
        });

        widgetIdRef.current = widgetId ?? null;
        setStatus(widgetId ? "ready" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      settle(null);

      const widgetId = widgetIdRef.current;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  // Reset first: tokens are single-use, so every submit mints a fresh one.
  const getToken = useCallback((): Promise<string> => {
    const widgetId = widgetIdRef.current;

    if (!widgetId || !window.turnstile) return Promise.reject(new Error("Turnstile unavailable"));

    window.turnstile.reset(widgetId);

    return new Promise<string>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        pendingRef.current = null;
        reject(new Error("Turnstile timed out"));
      }, TOKEN_TIMEOUT_MS);

      pendingRef.current = (token) => {
        window.clearTimeout(timeout);
        if (token) resolve(token);
        else reject(new Error("Turnstile failed"));
      };

      window.turnstile?.execute(widgetId);
    });
  }, []);

  return { containerRef, status, getToken };
};
