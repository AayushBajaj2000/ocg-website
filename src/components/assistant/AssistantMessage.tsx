import { Fragment } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

// The assistant is told to keep to paragraphs, "- " bullets, **bold** and Markdown links, so
// that is all this renders. Anything else shows as the plain text it is.
const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

const renderInline = (text: string, onNavigate?: () => void): ReactNode[] =>
  text.split(INLINE).map((part, index) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) return <strong key={index}>{bold[1]}</strong>;

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const className = "text-brand-blue underline underline-offset-2";
      // Model output is untrusted: only site paths and http(s) become links.
      if (href.startsWith("/") && !href.startsWith("//")) {
        return (
          <Link key={index} href={href} onClick={onNavigate} className={className}>
            {label}
          </Link>
        );
      }
      if (/^https?:\/\//.test(href)) {
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {label}
          </a>
        );
      }
      return <Fragment key={index}>{label}</Fragment>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });

type Props = {
  content: string;
  /** Called when a site link is followed, so the panel can get out of the way. */
  onNavigate?: () => void;
};

const AssistantMessage: React.FC<Props> = ({ content, onNavigate }) => {
  const blocks = content.split(/\n{2,}/).filter((block) => block.trim());

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        const isList = lines.every((line) => /^\s*[-•]\s+/.test(line));

        if (isList) {
          return (
            <ul key={index} className="flex list-disc flex-col gap-1 pl-5">
              {lines.map((line, item) => (
                <li key={item}>{renderInline(line.replace(/^\s*[-•]\s+/, ""), onNavigate)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index}>
            {lines.map((line, item) => (
              <Fragment key={item}>
                {item > 0 && <br />}
                {renderInline(line, onNavigate)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export default AssistantMessage;
