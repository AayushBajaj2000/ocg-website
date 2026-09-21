import { Fragment } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

// The assistant is told to keep to paragraphs, "- " bullets, **bold** and Markdown links. Models
// don't always comply, so bare URLs and email addresses are linked too. Anything else shows as
// the plain text it is: model output is untrusted, and nothing here renders HTML.
const INLINE = new RegExp(
  [
    String.raw`\*\*[^*]+\*\*`, // **bold**
    String.raw`\[[^\]]+\]\s?\([^)]+\)`, // [label](target), tolerating a space and a "title"
    String.raw`https?:\/\/[^\s<>()]+`, // bare URL
    String.raw`[\w.+-]+@[\w-]+(?:\.[\w-]+)+`, // bare email address
  ]
    .map((pattern) => `(?:${pattern})`)
    .join("|"),
  "g",
);

const LINK_CLASS = "text-brand-blue underline underline-offset-2 hover:no-underline";

// Our own pages, however the model wrote them, are in-app navigations rather than new tabs.
const OWN_HOSTS = new Set(["opencoregroup.com", "www.opencoregroup.com"]);

/** A site-relative path for internal targets, `null` for everything else. */
const toInternalPath = (target: string): string | null => {
  if (target.startsWith("/") && !target.startsWith("//")) return target;
  try {
    const url = new URL(target);
    if (!OWN_HOSTS.has(url.host)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};

const renderLink = (
  key: number,
  label: string,
  target: string,
  onNavigate?: () => void,
): ReactNode => {
  const internal = toInternalPath(target);
  if (internal) {
    return (
      <Link key={key} href={internal} onClick={onNavigate} className={LINK_CLASS}>
        {label}
      </Link>
    );
  }
  if (/^https?:\/\//i.test(target)) {
    return (
      <a key={key} href={target} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        {label}
      </a>
    );
  }
  if (/^(mailto|tel):/i.test(target)) {
    return (
      <a key={key} href={target} className={LINK_CLASS}>
        {label}
      </a>
    );
  }
  // javascript:, data: and anything else unrecognised: keep the words, drop the target.
  return <Fragment key={key}>{label}</Fragment>;
};

const renderInline = (text: string, onNavigate?: () => void): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE)) {
    const token = match[0];
    const start = match.index;
    if (start > cursor) nodes.push(<Fragment key={key++}>{text.slice(cursor, start)}</Fragment>);
    cursor = start + token.length;

    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
      continue;
    }

    const markdown = /^\[([^\]]+)\]\s?\(\s*(\S+?)(?:\s+"[^"]*")?\s*\)$/.exec(token);
    if (markdown) {
      nodes.push(renderLink(key++, markdown[1], markdown[2], onNavigate));
      continue;
    }

    if (token.includes("@") && !token.includes("://")) {
      nodes.push(renderLink(key++, token, `mailto:${token}`, onNavigate));
      continue;
    }

    // A bare URL at the end of a sentence drags the punctuation in with it; hand that back.
    const trailing = /[.,;:!?'"]+$/.exec(token)?.[0] ?? "";
    const url = trailing ? token.slice(0, -trailing.length) : token;
    const label = toInternalPath(url) ?? url.replace(/^https?:\/\//i, "");
    nodes.push(renderLink(key++, label, url, onNavigate));
    if (trailing) nodes.push(<Fragment key={key++}>{trailing}</Fragment>);
  }

  if (cursor < text.length) nodes.push(<Fragment key={key++}>{text.slice(cursor)}</Fragment>);
  return nodes;
};

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
        const isList = lines.every((line) => /^\s*[-•*]\s+/.test(line));

        if (isList) {
          return (
            <ul key={index} className="flex list-disc flex-col gap-1 pl-5">
              {lines.map((line, item) => (
                <li key={item}>{renderInline(line.replace(/^\s*[-•*]\s+/, ""), onNavigate)}</li>
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
