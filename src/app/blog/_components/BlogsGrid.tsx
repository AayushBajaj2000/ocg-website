"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CardGridSection from "@/components/layout/sections/CardGridSection";
import BlogCategoryFilter from "@/app/blog/_components/BlogCategoryFilter";
import { blogPostsQueryOptions } from "@/lib/blog/queries";
import { filterBlogPosts, toBlogCard } from "@/lib/blog/utils";
import type { BlogCategoryFilterValue } from "@/types";

const BlogsGrid: React.FC = () => {
  const { data: posts, isError } = useQuery(blogPostsQueryOptions);
  const [selected, setSelected] = useState<BlogCategoryFilterValue>("all");

  const cards = useMemo(
    () => posts && filterBlogPosts(posts, selected).map((post) => toBlogCard(post, selected)),
    [posts, selected],
  );

  return (
    <CardGridSection
      label="Insights"
      cards={cards}
      isError={isError}
      filter={<BlogCategoryFilter selected={selected} onSelect={setSelected} />}
      noun={{ one: "insight", other: "insights" }}
      emptyMessage="Nothing here yet. Try another category."
      errorMessage="We couldn't load insights right now. Please try again later."
    />
  );
};

export default BlogsGrid;
