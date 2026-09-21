"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useDesktopMode } from "@/app/_components/desktop-hero/DesktopMode";
import { ICON_ART, ICON_LABEL, ICON_WRAPPER } from "@/app/_components/desktop-hero/desktopStyles";
import type { IHomeDesktopFile } from "@/types";

type Props = {
  label: string;
  /** Where the folder leads without JS, or on a cmd/ctrl/middle-click. */
  href: string;
  files: IHomeDesktopFile[];
};

// How the first few files fan out of the folder's mouth.
const PEEK = [
  "-rotate-10 -translate-x-3.5",
  "rotate-0 -translate-y-1",
  "rotate-10 translate-x-3.5",
];

/** The Projects folder: previews what is inside, and opens the Finder window on click. */
const DesktopFolder: React.FC<Props> = ({ label, href, files }) => {
  const { openFinder } = useDesktopMode();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    event.preventDefault();
    openFinder();
  };

  return (
    <Link href={href} onClick={onClick} className={ICON_WRAPPER}>
      <span className={ICON_ART}>
        <span className="relative h-13 w-16 shrink-0 scale-[var(--icon-scale,1)] transition-transform duration-200 md:group-hover:scale-105 md:group-active:scale-95">
          <svg viewBox="0 0 64 52" aria-hidden className="absolute inset-0 size-full">
            <path
              d="M2 8a4 4 0 0 1 4-4h16l6 6h30a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"
              fill="#3f9ae6"
            />
          </svg>
          {files.slice(0, PEEK.length).map((file, index) => (
            <span
              key={file.href}
              className={`absolute top-2.5 left-1/2 -ml-3.5 h-5 w-7 overflow-hidden rounded-xs bg-white shadow-sm ring-1 ring-black/10 transition-transform duration-200 group-hover:-translate-y-1.5 ${PEEK[index]}`}
            >
              <Image src={file.img.url} alt="" fill sizes="28px" className="object-cover" />
            </span>
          ))}
          <svg
            viewBox="0 0 64 52"
            aria-hidden
            className="absolute inset-0 size-full drop-shadow-sm"
          >
            <path
              d="M2 22a4 4 0 0 1 4-4h52a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"
              fill="#6cb8f5"
            />
          </svg>
        </span>
      </span>
      <span className={ICON_LABEL}>{label}</span>
    </Link>
  );
};

export default DesktopFolder;
