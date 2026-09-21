import localFont from "next/font/local";
import {
  Inter,
  Dancing_Script,
  Allura,
  JetBrains_Mono,
  Caveat,
  Gloria_Hallelujah,
} from "next/font/google";

export const switzer = localFont({
  src: [
    {
      path: "../fonts/Switzer-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Switzer-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-switzer-local",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
  display: "swap",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
  display: "swap",
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

export const gloriaHallelujah = Gloria_Hallelujah({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gloria-hallelujah",
  display: "swap",
  preload: false,
});
