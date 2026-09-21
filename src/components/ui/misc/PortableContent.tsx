import { Fragment, type ReactNode } from "react";
import type {
  PortableTextBlock,
  PortableTextComponents,
  PortableTextDecorator,
  PortableTextListItemType,
  PortableTextSpan,
} from "@/types";

type Props = {
  value: PortableTextBlock[];
  components?: PortableTextComponents;
};

type RenderNode =
  | { kind: "block"; block: PortableTextBlock }
  | { kind: "list"; key: string; listItem: PortableTextListItemType; items: PortableTextBlock[] };

const DECORATORS = new Set<string>(["strong", "em", "underline", "code"]);

const defaultComponents: Required<{
  [K in keyof PortableTextComponents]-?: Required<NonNullable<PortableTextComponents[K]>>;
}> = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    h5: ({ children }) => <h5>{children}</h5>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    code: ({ children }) => <code>{children}</code>,
    link: ({ value, children }) => <a href={value.href}>{children}</a>,
  },
};

const groupBlocks = (blocks: PortableTextBlock[]): RenderNode[] =>
  blocks.reduce<RenderNode[]>((nodes, block) => {
    if (!block.listItem) return [...nodes, { kind: "block", block }];

    const previous = nodes.at(-1);
    if (previous?.kind === "list" && previous.listItem === block.listItem) {
      previous.items.push(block);
      return nodes;
    }

    return [...nodes, { kind: "list", key: block._key, listItem: block.listItem, items: [block] }];
  }, []);

const PortableContent: React.FC<Props> = ({ value, components }) => {
  const block = { ...defaultComponents.block, ...components?.block };
  const list = { ...defaultComponents.list, ...components?.list };
  const listItem = { ...defaultComponents.listItem, ...components?.listItem };
  const marks = { ...defaultComponents.marks, ...components?.marks };

  const renderSpan = (span: PortableTextSpan, parent: PortableTextBlock): ReactNode =>
    (span.marks ?? []).reduceRight<ReactNode>((children, mark) => {
      if (DECORATORS.has(mark)) {
        const Decorator = marks[mark as PortableTextDecorator];
        return (
          <Decorator value={undefined} text={span.text}>
            {children}
          </Decorator>
        );
      }

      const definition = parent.markDefs?.find((def) => def._key === mark);
      if (definition?._type !== "link") return children;

      const Link = marks.link;
      return (
        <Link value={definition} text={span.text}>
          {children}
        </Link>
      );
    }, span.text);

  const renderChildren = (parent: PortableTextBlock) =>
    parent.children.map((span) => <Fragment key={span._key}>{renderSpan(span, parent)}</Fragment>);

  return groupBlocks(value).map((node) => {
    if (node.kind === "block") {
      const Block = block[node.block.style ?? "normal"];
      return (
        <Block key={node.block._key} value={node.block}>
          {renderChildren(node.block)}
        </Block>
      );
    }

    const List = list[node.listItem];
    const Item = listItem[node.listItem];
    return (
      <List key={node.key} value={node.items}>
        {node.items.map((item) => (
          <Item key={item._key} value={item}>
            {renderChildren(item)}
          </Item>
        ))}
      </List>
    );
  });
};

export default PortableContent;
