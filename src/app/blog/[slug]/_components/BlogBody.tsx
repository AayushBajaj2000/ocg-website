import PortableContent from "@/components/ui/misc/PortableContent";
import SanityImage from "@/components/ui/misc/SanityImage";
import { cn } from "@/lib/utils";
import type { BlogBodyNode, PortableTextBlockProps, PortableTextComponents } from "@/types";

type Props = {
  body: BlogBodyNode[];
  headingIds: Record<string, string>;
};

// Headings sit below the fixed header when jumped to from the table of contents.
const HEADING_BASE =
  "text-black-1 scroll-mt-28 font-medium tracking-[-2%] text-balance md:scroll-mt-32";

const BlogBody: React.FC<Props> = ({ body, headingIds }) => {
  const heading =
    (Tag: "h2" | "h3" | "h4" | "h5", className: string): React.FC<PortableTextBlockProps> =>
    // eslint-disable-next-line react/display-name
    ({ value, children }) => (
      <Tag id={headingIds[value._key]} className={cn(HEADING_BASE, className)}>
        {children}
      </Tag>
    );

  const components: PortableTextComponents = {
    block: {
      // Editors break lines inside a paragraph with Shift+Enter; keep those breaks.
      normal: ({ children }) => <p className="whitespace-pre-line">{children}</p>,
      h2: heading("h2", "mt-6 text-2xl first:mt-0 md:mt-8 md:text-[2rem] md:leading-[2.375rem]"),
      h3: heading("h3", "mt-6 text-xl first:mt-0 md:mt-8 md:text-[1.75rem] md:leading-9"),
      h4: heading("h4", "mt-4 text-lg first:mt-0 md:mt-6 md:text-2xl"),
      h5: heading("h5", "mt-4 text-base first:mt-0 md:text-xl"),
      blockquote: ({ children }) => (
        <blockquote className="border-brand-blue text-black-2 border-l-2 pl-4 md:pl-6">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>,
      number: ({ children }) => (
        <ol className="flex list-decimal flex-col gap-2 pl-5">{children}</ol>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="text-black-1 font-medium">{children}</strong>,
      code: ({ children }) => (
        <code className="bg-sunken font-jetbrains-mono text-black-1 px-1 py-0.5 text-[0.875em]">
          {children}
        </code>
      ),
      link: ({ value, children }) => {
        const isExternal = /^https?:\/\//.test(value.href);
        return (
          <a
            href={value.href}
            {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
            className="text-brand-blue underline underline-offset-4 hover:no-underline"
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className="text-black-3 md:text-body-desktop text-body-mobile [&>p:first-child]:text-black-2 flex flex-col gap-4 tracking-[-2%] md:gap-6 [&>p:first-child]:text-base md:[&>p:first-child]:text-xl md:[&>p:first-child]:leading-7.5">
      {body.map((node) => {
        if (node.kind === "text")
          return <PortableContent key={node.key} value={node.blocks} components={components} />;

        if (node.kind === "code")
          return (
            <pre
              key={node.key}
              tabIndex={0}
              className="border-hairline bg-sunken font-jetbrains-mono text-black-1 focus-visible:outline-brand-blue overflow-x-auto border p-4 text-xs leading-5 tracking-normal focus-visible:outline-2 md:p-6 md:text-sm md:leading-6"
            >
              <code>{node.code}</code>
            </pre>
          );

        const { image } = node;
        return (
          <figure key={node.key} className="border-hairline bg-sunken border">
            <SanityImage
              src={image.url}
              alt={image.alt}
              width={image.width ?? 1000}
              height={image.height ?? 563}
              sizes="(min-width: 1024px) 1000px, 100vw"
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL}
              className="h-auto w-full"
            />
          </figure>
        );
      })}
    </div>
  );
};

export default BlogBody;
