"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ITocItem } from "@/types";

type Props = {
  items: ITocItem[];
};

// A heading counts as reached once it is this far from the top: just under the fixed header.
const ACTIVE_LINE = 160;

/**
 * Table of contents. A plain list of jump links on small screens; on desktop it sticks beside the
 * article and marks the section being read: the last heading to have passed the top of the view.
 */
const TableOfContents: React.FC<Props> = ({ items }) => {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    // Measured on scroll rather than with an IntersectionObserver: a jump link or a fast scroll can
    // carry a heading past the viewport without it ever intersecting, which leaves the marker stale.
    // Scroll events already arrive once per frame, and React drops the update when nothing changed.
    const update = () => {
      const passed = headings.filter(
        (heading) => heading.getBoundingClientRect().top < ACTIVE_LINE,
      );
      setActiveId((passed.at(-1) ?? headings[0]).id);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav
      aria-label="Table of contents"
      className="border-hairline border p-4 lg:sticky lg:top-32 lg:w-65 lg:shrink-0 lg:self-start lg:border-0 lg:p-0"
    >
      <p className="font-jetbrains-mono text-black-3 text-[0.6875rem] tracking-[6%] uppercase">
        Table of contents
      </p>
      <ol className="mt-1 flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "focus-visible:outline-brand-blue inline-block px-3 py-2 text-sm tracking-[-2%] transition-colors focus-visible:outline-2",
                  isActive ? "text-black-1 lg:bg-sunken" : "text-black-3 hover:text-black-1",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default TableOfContents;
