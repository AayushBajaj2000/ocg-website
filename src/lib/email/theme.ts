import type { CSSProperties } from "react";

export const emailTheme = {
  brandBlue: "#2068cc",
  ink: "#131313",
  body: "#323232",
  muted: "#5b5b5b",
  hairline: "#e3e3e3",
  sunken: "#f7f7f7",
  white: "#ffffff",
  fontFamily: '"Switzer", "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

export const emailStyles = {
  body: {
    margin: "0",
    padding: "24px 0",
    backgroundColor: emailTheme.sunken,
    fontFamily: emailTheme.fontFamily,
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: emailTheme.white,
    border: `1px solid ${emailTheme.hairline}`,
  },
  header: { padding: "32px 32px 0 32px" },
  logo: {
    display: "block",
    color: emailTheme.brandBlue,
    fontSize: "22px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  // On an <hr>: a border renders reliably in Outlook, where an empty styled div collapses.
  accent: { margin: "24px 0 0 0", border: "none", borderTop: `4px solid ${emailTheme.brandBlue}` },
  content: { padding: "32px" },
  eyebrow: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: emailTheme.brandBlue,
    fontWeight: 500,
  },
  heading: {
    margin: "0 0 24px 0",
    fontSize: "26px",
    lineHeight: "32px",
    color: emailTheme.ink,
    fontWeight: 500,
    letterSpacing: "-0.02em",
  },
  paragraph: { margin: "0 0 16px 0", fontSize: "15px", lineHeight: "24px", color: emailTheme.body },
  row: { padding: "16px 0", borderBottom: `1px solid ${emailTheme.hairline}` },
  label: {
    margin: "0 0 4px 0",
    fontSize: "12px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: emailTheme.muted,
  },
  value: {
    margin: "0",
    fontSize: "15px",
    lineHeight: "24px",
    color: emailTheme.ink,
    whiteSpace: "pre-wrap",
  },
  footer: { padding: "0 32px 32px 32px" },
  footerText: { margin: "0", fontSize: "12px", lineHeight: "20px", color: emailTheme.muted },
  link: { color: emailTheme.brandBlue, textDecoration: "underline" },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: emailTheme.brandBlue,
    color: emailTheme.white,
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
  },
} as const satisfies Record<string, CSSProperties>;
