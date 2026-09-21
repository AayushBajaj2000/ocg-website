"use client";

import { ExpandIcon } from "@/components/icons";
import Image from "next/image";

type Props = {
  onOpen: (index: number) => void;
};

const WORK_CARDS = [
  {
    url: "/fraiche-table/work/img-1.webp",
    alt: "work img 1",
    width: 296,
    height: 191,
    title: "The Migration & New Build",
    description: "Rebuild the foundation. Ship the vision faster.",
  },
  {
    url: "/fraiche-table/work/img-2.webp",
    alt: "work img 2",
    width: 198,
    height: 281,
    title: "Squeeze",
    description: "Tinder for dinners. Stop scrolling, start swiping",
  },
  {
    url: "/fraiche-table/work/img-3.webp",
    alt: "work img 3",
    width: 185,
    height: 185,
    title: "Lucy AI",
    description: "An AI that knows the menu and never invents one.",
  },
];

const WorkCards: React.FC<Props> = ({ onOpen }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {WORK_CARDS.map((c, i) => (
        <button
          type="button"
          onClick={() => onOpen(i)}
          className="relative flex cursor-pointer flex-col justify-end gap-6 border border-neutral-200 bg-white p-5 text-left transition-colors duration-300 ease-out hover:border-neutral-400 motion-reduce:transition-none md:h-114.5 md:gap-10 lg:gap-16"
          key={`${c.title}-${i}`}
        >
          <span className="border-hairline absolute top-5 right-5 grid size-10 place-content-center border">
            <ExpandIcon />
          </span>
          <Image
            src={c.url}
            alt={c.alt}
            width={c.width}
            height={c.height}
            className="mx-auto object-cover"
          />
          <div className="flex flex-col">
            <span className="font-switzer text-black-1 font-medium tracking-[-2%] md:text-xl">
              {c.title}
            </span>
            <span className="font-switzer text-black-3 text-xs tracking-[-2%] md:text-sm">
              {c.description}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default WorkCards;
