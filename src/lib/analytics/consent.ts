// The visitor's cookie choice, kept in localStorage and shared between the banner, the footer's
// "Cookie preferences" link and the analytics loader through one tiny store.

export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "ocg-analytics-consent";
const CHANGE_EVENT = "ocg-consent-change";

const isChoice = (value: string | null): value is ConsentChoice =>
  value === "granted" || value === "denied";

/** `null` until the visitor has answered. Storage can throw (private mode, blocked site data). */
export const readConsent = (): ConsentChoice | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isChoice(value) ? value : null;
  } catch {
    return null;
  }
};

export const writeConsent = (choice: ConsentChoice | null): void => {
  try {
    if (choice) window.localStorage.setItem(STORAGE_KEY, choice);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Without storage the choice only lasts for this page view, which is the safe direction.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

/** Forgets the choice, which brings the banner back. */
export const reopenConsent = (): void => writeConsent(null);

export const subscribeToConsent = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  // Another tab changed it.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};
