import { BLOG_CATEGORIES } from "@/lib/constants/blog";
import { cn } from "@/lib/utils";
import type { BlogCategoryFilterValue } from "@/types";

type Props = {
  selected: BlogCategoryFilterValue;
  onSelect: (value: BlogCategoryFilterValue) => void;
};

const BlogCategoryFilter: React.FC<Props> = ({ selected, onSelect }) => (
  <div
    role="group"
    aria-label="Filter insights by category"
    className="mx-auto flex max-w-152 flex-wrap justify-center gap-2 md:flex-nowrap"
  >
    {BLOG_CATEGORIES.map(({ label, value }) => {
      const isActive = value === selected;

      return (
        <button
          key={value}
          type="button"
          aria-pressed={isActive}
          onClick={() => onSelect(value)}
          className={cn(
            "font-switzer focus-visible:outline-brand-blue grid h-10 cursor-pointer place-content-center border px-4 text-sm font-medium tracking-[-2%] whitespace-nowrap transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
            isActive
              ? "bg-brand-blue border-brand-blue text-neutral-50"
              : "text-black-1 border-hairline bg-white",
          )}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export default BlogCategoryFilter;
