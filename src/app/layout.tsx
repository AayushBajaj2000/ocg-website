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
import "./globals.css";

export const metadata: Metadata = {
  // Resolves relative canonical and share-image URLs against the production host.
  metadataBase: new URL(getSiteUrl()),
  title: "OpenCore Group",
  description:
    "OpenCore Group partners with growing businesses and startups to create stronger brands, better customer experiences, and products that drive growth.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${switzer.variable} ${inter.variable} ${dancingScript.variable} ${allura.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="bg-page-alt font-switzer flex min-h-full flex-col">
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
