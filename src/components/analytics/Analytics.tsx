"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { readConsent, subscribeToConsent } from "@/lib/analytics/consent";
import { GA_MEASUREMENT_ID, isAnalyticsHost } from "@/lib/analytics/gtag";

const subscribeToNothing = () => () => {};

/**
 * Google Analytics, loaded only after the visitor accepts cookies and only on the production host.
 * Until then nothing is requested from Google and no cookie is set.
 */
const Analytics: React.FC = () => {
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => null);
  const isEnabled = useSyncExternalStore(
    subscribeToNothing,
    () => isAnalyticsHost(window.location.hostname),
    () => false,
  );
  // Once loaded, the scripts stay mounted: a later change of mind is a Consent Mode update, which
  // stops (or resumes) GA's cookies without a reload.
  const [hasLoaded, setHasLoaded] = useState(false);
  if (consent === "granted" && !hasLoaded) setHasLoaded(true);

  useEffect(() => {
    if (!consent) return;
    window.gtag?.("consent", "update", { analytics_storage: consent });
  }, [consent]);

  if (!isEnabled || !hasLoaded) return null;

  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
};

export default Analytics;
