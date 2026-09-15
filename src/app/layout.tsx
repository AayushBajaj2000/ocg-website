import type { Metadata } from "next";
import { switzer, inter, dancingScript, allura, jetbrainsMono } from "@/lib/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FaqSection from "@/components/layout/FaqSection";
import PageDivider from "@/components/ui/PageDivider";
import BuildingSection from "@/components/layout/BuildingSection";
import "./globals.css";

export const metadata: Metadata = {
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
        <Header />
        <main className="mt-19.25 md:mt-24.75">{children}</main>
        <PageDivider />
        <FaqSection />
        <PageDivider />
        <BuildingSection />
        <PageDivider />
        <Footer />
      </body>
    </html>
  );
}
