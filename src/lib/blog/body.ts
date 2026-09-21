import { toSanityImage } from "@/lib/sanity/image";
import type {
  BlogBodyNode,
  IBlogTocItem,
  PortableTextBlock,
  SanityBlogImageBlock,
  SanityBlogPostDetail,
} from "@/types";

type RawBlock = SanityBlogPostDetail["body"][number];

const HEADING_STYLES = ["h2", "h3", "h4", "h5"] as const;

const isImage = (block: RawBlock): block is SanityBlogImageBlock => block._type === "image";

const blockText = (block: PortableTextBlock) => block.children.map((span) => span.text).join("");

// Posts paste code in as ordinary paragraphs with every span marked `code`, one line (or a few)
// per block. Those read as a fenced block, not as a stack of inline snippets.
const isCodeLine = (block: PortableTextBlock) =>
  !block.listItem &&
  (block.style ?? "normal") === "normal" &&
  block.children.every((span) => !span.text.trim() || span.marks?.includes("code"));

// Pasted text often opens or closes a paragraph with stray line breaks. Breaks inside a paragraph
// are kept (they render), so these would show up as uneven gaps between paragraphs.
const trimBlock = (block: PortableTextBlock): PortableTextBlock => {
  const last = block.children.length - 1;
  return {
    ...block,
    children: block.children.map((span, index) => ({
      ...span,
      text: span.text
        .replace(index === 0 ? /^\s+/ : "", "")
        .replace(index === last ? /\s+$/ : "", ""),
    })),
  };
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Regroups a post's Portable Text for rendering: drops the empty paragraphs editors use as
 * spacing, fuses runs of code-only paragraphs into one code block, and resolves inline images.
 */
export const toBlogBody = (blocks: RawBlock[]): BlogBodyNode[] =>
  blocks.reduce<BlogBodyNode[]>((nodes, block) => {
    if (isImage(block)) {
      const image = toSanityImage(block.asset);
      return image ? [...nodes, { kind: "image", key: block._key, image }] : nodes;
    }

    if (block._type !== "block") return nodes;

    const text = blockText(block);
    const previous = nodes.at(-1);

    if (!text.trim()) {
      // A blank line inside code is part of the code; anywhere else it is just spacing.
      if (previous?.kind === "code") previous.code += "\n";
      return nodes;
    }

    if (isCodeLine(block)) {
      if (previous?.kind === "code") {
        previous.code += `\n${text}`;
        return nodes;
      }
      return [...nodes, { kind: "code", key: block._key, code: text }];
    }

    const trimmed = trimBlock(block);
    if (previous?.kind === "text") {
      previous.blocks.push(trimmed);
      return nodes;
    }
    return [...nodes, { kind: "text", key: block._key, blocks: [trimmed] }];
  }, []);

/**
 * Anchor ids for every heading, plus the table of contents. Posts don't agree on a heading level
 * (h2, h3 or h4 as the top one), so the contents list whichever level the post uses highest.
 */
export const toBlogHeadings = (
  body: BlogBodyNode[],
): { headingIds: Record<string, string>; toc: IBlogTocItem[] } => {
  const headings = body
    .flatMap((node) => (node.kind === "text" ? node.blocks : []))
    .filter((block) => HEADING_STYLES.some((style) => style === block.style));

  const used = new Map<string, number>();
  const headingIds: Record<string, string> = {};
  for (const heading of headings) {
    const base = slugify(blockText(heading)) || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    headingIds[heading._key] = count ? `${base}-${count + 1}` : base;
  }

  const topStyle = HEADING_STYLES.find((style) => headings.some((h) => h.style === style));
  const toc = headings
    .filter((heading) => heading.style === topStyle)
    .map((heading) => ({ id: headingIds[heading._key], text: blockText(heading).trim() }));

  return { headingIds, toc };
};
