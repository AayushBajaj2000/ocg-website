import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const BAR = "bg-placeholder block animate-pulse motion-reduce:animate-none";

// Mirrors BlogCard's box model line for line (each row is one line-height tall at the same font
// size) so swapping skeletons for cards causes no layout shift.
const BlogCardSkeleton: React.FC<Props> = ({ className }) => (
  <span aria-hidden="true" className={cn("flex w-full flex-col gap-2 p-5", className)}>
    <span className={cn(BAR, "relative aspect-320/198 w-full")}>
      <span className="absolute top-2.5 left-2.5 block h-6 w-20 bg-neutral-200" />
    </span>
    <span className="flex h-lh items-center text-xs">
      <span className={cn(BAR, "h-3 w-24")} />
    </span>
    <span className="flex flex-col text-base">
      <span className="flex h-lh items-center">
        <span className={cn(BAR, "h-4 w-full")} />
      </span>
      <span className="flex h-lh items-center">
        <span className={cn(BAR, "h-4 w-3/5")} />
      </span>
    </span>
    <span className="flex h-lh items-center text-xs">
      <span className={cn(BAR, "h-3 w-40")} />
    </span>
  </span>
);

export default BlogCardSkeleton;
