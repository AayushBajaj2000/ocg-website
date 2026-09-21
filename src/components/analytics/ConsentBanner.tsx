"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { readConsent, subscribeToConsent, writeConsent } from "@/lib/analytics/consent";

const BUTTON_BASE =
  "h-10 flex-1 cursor-pointer px-4 text-sm font-medium tracking-[-2%] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

/**
 * Cookie choice, shown until the visitor answers. Not a modal: it never blocks the page, traps
 * focus or dims anything, and "Decline" is as easy to reach as "Accept".
 */
const ConsentBanner: React.FC = () => {
  // "pending" on the server and during hydration, so the banner never flashes for someone who
  // has already answered.
  const consent = useSyncExternalStore(
    subscribeToConsent,
    () => readConsent() ?? "unanswered",
    () => "pending" as const,
  );

  if (consent !== "unanswered") return null;

  return (
    <section
      aria-label="Cookie preferences"
      data-consent-banner
      className="border-hairline shadow-team-card fixed inset-x-4 bottom-4 z-50 flex flex-col gap-4 border bg-white p-4 md:inset-x-auto md:bottom-6 md:left-6 md:w-90 md:p-5"
    >
      <div className="flex flex-col gap-1.5">
        <p className="font-jetbrains-mono text-black-3 text-[0.6875rem] tracking-[6%] uppercase">
          Cookies
        </p>
        <p className="text-black-2 text-sm tracking-[-2%]">
          We use analytics cookies to see how the site is used. No ads, and nothing is sold.{" "}
          <Link
            href="/privacy"
            className="text-black-1 underline underline-offset-2 hover:no-underline"
          >
            Privacy policy
          </Link>
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          className={`${BUTTON_BASE} border-hairline text-black-1 hover:border-black-1 border bg-white`}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className={`${BUTTON_BASE} bg-brand-blue hover:bg-black-1 text-white`}
        >
          Accept
        </button>
      </div>
    </section>
  );
};

export default ConsentBanner;
