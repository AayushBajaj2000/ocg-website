import { cn } from "@/lib/utils";
import Image from "next/image";

export type ResultItem = {
  /** Vectorised pixel icon; sized per icon because each one bleeds past its frame differently. */
  icon: { src: string; width: number; height: number };
  title?: string;
  description: string;
};

type Props = {
  items: readonly ResultItem[];
  /** Height/spacing of each cell; the grids in the design use different ones. */
  cellClassName?: string;
};

const BORDER_CLASS = [
  "border-b md:border-r lg:border-b-0",
  "border-b lg:border-r lg:border-b-0",
  "border-b md:border-r md:border-b-0",
  "",
];

const ResultsGrid: React.FC<Props> = ({ items, cellClassName }) => {
  return (
    <ul className="grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <li
          key={item.description}
          className={cn(
            "flex h-60 flex-col justify-between gap-10 border-neutral-200 bg-white p-7 md:h-71",
            BORDER_CLASS[i],
            cellClassName,
          )}
        >
          <div className="grid size-14 shrink-0 place-content-center overflow-hidden rounded-sm border border-neutral-300 bg-white">
            <Image
              src={item.icon.src}
              alt=""
              width={item.icon.width}
              height={item.icon.height}
              unoptimized
              className="max-w-none"
              style={{ width: item.icon.width, height: item.icon.height }}
            />
          </div>
          <div className="flex flex-col gap-2">
            {item.title && <p className="font-switzer text-base text-black">{item.title}</p>}
            <span className="font-switzer text-black-3 text-sm">{item.description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ResultsGrid;
