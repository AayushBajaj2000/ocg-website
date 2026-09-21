import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PAGE_SEO, SHARE_IMAGE_SIZE, type PageSeoKey } from "@/lib/seo/pages";

// Share images (1200 × 630) for the static pages, drawn from the same registry as their titles.
// A route rather than `opengraph-image` files: file-based images override a page's own metadata,
// which would replace each blog post's cover with the generic /blog card.
export const dynamicParams = false;

export const generateStaticParams = () => Object.keys(PAGE_SEO).map((key) => ({ key }));

// ImageResponse can't read woff2, so these are TTF copies of the site's Switzer files.
const fonts = Promise.all(
  (["Medium", "Regular"] as const).map((weight) =>
    readFile(join(process.cwd(), `src/fonts/Switzer-${weight}.ttf`)),
  ),
);

// The real logo file, inlined: ImageResponse can only load images from a URL or a data URI.
const logoFile = readFile(join(process.cwd(), "public/logo-filled.svg"), "base64");

const BLUE = "#2068cc";
const INK = "#131313";
const GRID = "#e3e3e3";

export const GET = async (_request: Request, { params }: RouteContext<"/og/[key]">) => {
  const { key } = await params;
  const page = PAGE_SEO[key as PageSeoKey];
  const [medium, regular] = await fonts;
  const logo = `data:image/svg+xml;base64,${await logoFile}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: "#fdfdfd",
        // The site's blueprint grid.
        backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        fontFamily: "Switzer",
        color: INK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>. */}
        <img src={logo} width={64} height={64} alt="" />
        <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-0.02em" }}>
          OpenCore Group
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: BLUE,
          }}
        >
          {page.eyebrow}
        </div>
        <div
          style={{
            fontSize: 68,
            lineHeight: 1.1,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {page.headline}
        </div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#5b5b5b" }}
      >
        <div>opencoregroup.com</div>
        <div>Design · Development · AI</div>
      </div>
    </div>,
    {
      ...SHARE_IMAGE_SIZE,
      fonts: [
        { name: "Switzer", data: medium, weight: 500, style: "normal" },
        { name: "Switzer", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
};
