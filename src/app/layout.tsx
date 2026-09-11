import type { Metadata } from "next";
import { switzer, inter, dancingScript, allura } from "@/lib/fonts";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "OpenCore Group",
  description:
    "OpenCore Group partners with growing businesses and startups to create stronger brands, better customer experiences, and products that drive growth.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${switzer.variable} ${inter.variable} ${dancingScript.variable} ${allura.variable} h-full antialiased`}
    >
      <body className="bg-neutral-25 flex min-h-full flex-col font-sans">
        <Header />
        <main className="mt-19.25 md:mt-24.75">{children}</main>
      </body>
    </html>
  );
}
