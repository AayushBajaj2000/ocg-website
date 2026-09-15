import type { ReactNode } from "react";

export type PortableTextBlockStyle = "normal" | "h2" | "h3" | "h4" | "blockquote";

export type PortableTextListItemType = "bullet" | "number";

export type PortableTextDecorator = "strong" | "em" | "underline" | "code";

export interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
}

export interface PortableTextLinkMark {
  _type: "link";
  _key: string;
  href: string;
}

export type PortableTextMarkDefinition = PortableTextLinkMark;

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style?: PortableTextBlockStyle;
  listItem?: PortableTextListItemType;
  level?: number;
  markDefs?: PortableTextMarkDefinition[];
  children: PortableTextSpan[];
}

export interface PortableTextBlockProps {
  value: PortableTextBlock;
  children: ReactNode;
}

export interface PortableTextListProps {
  value: PortableTextBlock[];
  children: ReactNode;
}

export interface PortableTextMarkProps<T = PortableTextMarkDefinition | undefined> {
  value: T;
  text: string;
  children: ReactNode;
}

export interface PortableTextComponents {
  block?: Partial<Record<PortableTextBlockStyle, React.FC<PortableTextBlockProps>>>;
  list?: Partial<Record<PortableTextListItemType, React.FC<PortableTextListProps>>>;
  listItem?: Partial<Record<PortableTextListItemType, React.FC<PortableTextBlockProps>>>;
  marks?: Partial<
    Record<PortableTextDecorator, React.FC<PortableTextMarkProps<undefined>>> & {
      link: React.FC<PortableTextMarkProps<PortableTextLinkMark>>;
    }
  >;
}
