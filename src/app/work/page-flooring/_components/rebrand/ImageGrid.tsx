import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

/**
 * Responsive image grid that lays images out on a two-column track.
 *
 * Each image is either `full` (spans both columns) or `half` (shares a row with
 * the next half). The layout is picked from the number of images, and can be
 * overridden per grid (`layout`) or per image (`span`):
 *
 *   1 → [ full ]
 *   2 → [ half | half ]
 *   3 → [ full ] [ half | half ]              (pass `layout` for half, half, full)
 *   4 → [ full ] [ full ] [ half | half ]
 *   5 → [ half | half ] [ full ] [ half | half ]
 *   6+ → the 5-image pattern repeats, and the remainder uses its own preset.
 *
 * Below `sm` everything stacks into a single column at each image's natural
 * aspect ratio. From `sm` up, halves in the same row stretch to a shared height
 * (the taller of the two) and crop with `object-cover`, so rows never go ragged.
 */

export type Gallery = {
  label: string;
  images: ImageGridItem[];
  layout?: ImageGridSpan[];
};

export type ImageGridSpan = "full" | "half";

type ImageGridItemBase = {
  alt: string;
  /** Overrides the span the layout would otherwise give this image. */
  span?: ImageGridSpan;
  /** Overrides the generated `sizes` for this image. */
  sizes?: string;
  className?: string;
};

/** Static import: dimensions and blur placeholder come from the build. */
type StaticImageGridItem = ImageGridItemBase & {
  src: StaticImageData;
  width?: never;
  height?: never;
};

/** String path: dimensions are required so the cell can reserve its space. */
type PathImageGridItem = ImageGridItemBase & {
  src: string;
  width: number;
  height: number;
};

export type ImageGridItem = StaticImageGridItem | PathImageGridItem;

type Props = {
  images: readonly ImageGridItem[];
  /** Explicit span per image, by index. Missing entries fall back to the preset. */
  layout?: readonly ImageGridSpan[];
  /**
   * Set when the grid is above the fold: the first row loads eagerly and the
   * first image gets `fetchPriority="high"` for LCP.
   */
  eager?: boolean;
  /** Accessible name for the list of images. */
  label?: string;
  className?: string;
};

const PRESETS: Record<number, readonly ImageGridSpan[]> = {
  1: ["full"],
  2: ["half", "half"],
  3: ["full", "half", "half"],
  4: ["full", "full", "half", "half"],
  5: ["half", "half", "full", "half", "half"],
};

const REPEAT_SIZE = 5;

/**
 * Rendered widths of the section container's content box (`.app-container` with
 * `px-4 md:px-5`, minus its 1px side borders) at each breakpoint, used to build accurate `sizes` strings.
 */
const CONTENT_WIDTHS = [
  { minWidth: 1536, width: 1395 },
  { minWidth: 1280, width: 1158 },
  { minWidth: 1024, width: 942 },
  { minWidth: 768, width: 686 },
  { minWidth: 640, width: 574 },
] as const;

const MOBILE_WIDTH = "calc(100vw - 2rem)";
const GAP_PX = { sm: 12, md: 18 } as const;

const buildSizes = (span: ImageGridSpan): string => {
  const queries = CONTENT_WIDTHS.map(({ minWidth, width }) => {
    const gap = minWidth >= 768 ? GAP_PX.md : GAP_PX.sm;
    const rendered = span === "full" ? width : Math.ceil((width - gap) / 2);
    return `(min-width: ${minWidth}px) ${rendered}px`;
  });
  return [...queries, MOBILE_WIDTH].join(", ");
};

const SIZES: Record<ImageGridSpan, string> = {
  full: buildSizes("full"),
  half: buildSizes("half"),
};

const presetFor = (count: number): ImageGridSpan[] => {
  const spans: ImageGridSpan[] = [];
  let remaining = count;
  while (remaining > REPEAT_SIZE) {
    spans.push(...PRESETS[REPEAT_SIZE]);
    remaining -= REPEAT_SIZE;
  }
  if (remaining > 0) spans.push(...PRESETS[remaining]);
  return spans;
};

/**
 * Resolves the final span of every image. Halves are paired in order; a half
 * with no partner (next image is full, or it is the last one) is promoted to
 * full so the grid never leaves an empty cell.
 */
const resolveSpans = (
  images: readonly ImageGridItem[],
  layout: readonly ImageGridSpan[] | undefined,
): ImageGridSpan[] => {
  const preset = presetFor(images.length);
  const requested = images.map((image, i) => image.span ?? layout?.[i] ?? preset[i]);

  const resolved: ImageGridSpan[] = [];
  for (let i = 0; i < requested.length; i++) {
    if (requested[i] === "half" && requested[i + 1] === "half") {
      resolved.push("half", "half");
      i++;
    } else {
      resolved.push("full");
    }
  }
  return resolved;
};

const getDimensions = (image: ImageGridItem) =>
  typeof image.src === "string"
    ? { width: image.width, height: image.height }
    : { width: image.src.width, height: image.src.height };

const ImageGrid: React.FC<Props> = ({ images, layout, eager = false, label, className }) => {
  if (!images.length) return null;

  const spans = resolveSpans(images, layout);
  // The first row is one full image or a pair of halves.
  const firstRowCount = spans[0] === "half" ? 2 : 1;

  return (
    <ul
      role="list"
      aria-label={label}
      className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4.5", className)}
    >
      {images.map((image, i) => {
        const span = spans[i];
        const { width, height } = getDimensions(image);
        const isStatic = typeof image.src !== "string";
        const isEager = eager && i < firstRowCount;

        return (
          <li
            key={typeof image.src === "string" ? image.src : image.src.src}
            className={cn(
              "relative overflow-hidden rounded-lg md:rounded-2xl",
              span === "full" && "sm:col-span-2",
              image.className,
            )}
          >
            {/* Reserves the image's natural aspect ratio; a taller neighbour in the same row can stretch the cell past it. */}
            <div aria-hidden="true" style={{ aspectRatio: `${width} / ${height}` }} />
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={image.sizes ?? SIZES[span]}
              placeholder={isStatic ? "blur" : "empty"}
              loading={isEager ? "eager" : "lazy"}
              fetchPriority={eager && i === 0 ? "high" : undefined}
              className="object-cover"
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ImageGrid;
