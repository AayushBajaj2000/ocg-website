"use client";
import { useState } from "react";
import Section from "@/components/layout/sections/Section";
import { cn } from "@/lib/utils";
import BlogCard from "@/components/ui/cards/BlogCard";
import { LATEST_CARDS } from "@/components/layout/header/HeaderDropdown";

const CATEGORIES: { name: string; value: string }[] = [
  { name: "All Insights", value: "all" },
  { name: "Design", value: "design" },
  { name: "Development", value: "development" },
  { name: "Technology", value: "technology" },
  { name: "Marketing", value: "marketing" },
  { name: "News", value: "news" },
];

const BlogsGrid: React.FC = () => {
  const [activeCat, setActiveCat] = useState<string>("all");

  return (
    <Section
      as="section"
      container
      containerClassName="flex flex-col md:gap-12 gap-8 md:pb-16 pb-10 border-x"
    >
      <div className="mx-auto flex max-w-152 flex-wrap justify-center gap-2 md:flex-nowrap md:justify-start">
        {CATEGORIES.map((c, i) => (
          <button
            key={`${c.name}-${c.value}-${i}`}
            type="button"
            className={cn(
              "font-switzer grid h-8.5 cursor-pointer place-content-center border px-3 text-xs font-medium tracking-[-2%] outline-none focus:outline-none sm:text-sm md:h-10 md:px-4",
              {
                "bg-brand-blue border-brand-blue text-neutral-50": c.value === activeCat,
                "text-black-1 border-hairline bg-white": c.value !== activeCat,
              },
            )}
            onClick={() => setActiveCat(c.value)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {LATEST_CARDS.map((card, i) => (
          <BlogCard key={`${card.title}-${i}`} {...card} className="p-0!" />
        ))}
      </div>
    </Section>
  );
};

export default BlogsGrid;
