"use client";

import { reopenConsent } from "@/lib/analytics/consent";

/** Forgets the saved cookie choice, which brings the consent banner back. */
const CookiePreferencesButton: React.FC<{ className?: string }> = ({ className }) => (
  <button type="button" onClick={reopenConsent} className={className}>
    Cookie preferences
  </button>
);

export default CookiePreferencesButton;
