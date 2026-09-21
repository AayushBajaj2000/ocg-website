import { getSiteUrl } from "@/lib/env/server";
import type { Metadata } from "next";
import { switzer, inter, dancingScript, allura, jetbrainsMono } from "@/lib/fonts";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import FaqSection from "@/components/layout/sections/FaqSection";
import PageDivider from "@/components/ui/dividers/PageDivider";
import BuildingSection from "@/components/layout/sections/BuildingSection";
import HideOnRoutes from "@/components/layout/HideOnRoutes";
import QueryProvider from "@/components/providers/QueryProvider";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, pageMetadata } from "@/lib/seo/pages";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/structuredData";
import "./globals.css";

const defaults = pageMetadata("home");

export const metadata: Metadata = {
  // Resolves relative canonical and share-image URLs against the production host.
  metadataBase: new URL(getSiteUrl()),
  // Defaults for any route without its own entry in PAGE_SEO (the 404 page, for one).
  // The home page's canonical and og:url are its own, so they are not inherited.
  ...defaults,
  alternates: undefined,
  openGraph: { ...defaults.openGraph, url: undefined },
  applicationName: SITE_NAME,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${switzer.variable} ${inter.variable} ${dancingScript.variable} ${allura.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="bg-page-alt font-switzer flex min-h-full flex-col">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <QueryProvider>
          <Header />
          <main className="mt-19.25 md:mt-24.75">{children}</main>
          <PageDivider />
          <FaqSection />
          <PageDivider />
          <HideOnRoutes routes={["/contact"]}>
            <BuildingSection />
            <PageDivider />
          </HideOnRoutes>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
