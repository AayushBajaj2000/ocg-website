"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/ui/cards/BlogCard";
import BlogsGridLayout from "@/app/blog/_components/BlogsGridLayout";
import BlogCategoryFilter from "@/app/blog/_components/BlogCategoryFilter";
import { BlogCardSkeletons, BlogsLoadingStatus } from "@/app/blog/_components/BlogsGridSkeleton";
import { blogPostsQueryOptions } from "@/lib/blog/queries";
import { filterBlogPosts, toBlogCard } from "@/lib/blog/utils";
import { sanityImageLoader } from "@/lib/sanity/image";
import { BLOG_CARD_IMAGE_SIZES, BLOG_EAGER_IMAGE_COUNT } from "@/lib/constants/blog";
import type { BlogCategoryFilterValue } from "@/types";

const BlogsGrid: React.FC = () => {
  const { data: posts, isPending, isError } = useQuery(blogPostsQueryOptions);
  const [selected, setSelected] = useState<BlogCategoryFilterValue>("all");

  const cards = useMemo(
    () => (posts ? filterBlogPosts(posts, selected).map((post) => toBlogCard(post, selected)) : []),
    [posts, selected],
  );

  const filter = <BlogCategoryFilter selected={selected} onSelect={setSelected} />;

  if (isPending)
    return (
      <BlogsGridLayout filter={filter} status={<BlogsLoadingStatus />} busy>
        <BlogCardSkeletons />
      </BlogsGridLayout>
    );

  const message = isError
    ? "We couldn't load insights right now. Please try again later."
    : cards.length === 0
      ? "Nothing here yet. Try another category."
      : null;

  return (
    <BlogsGridLayout
      filter={filter}
      status={
        <p role="status" className={message ? "text-black-2 text-center text-sm" : "sr-only"}>
          {message ?? `Showing ${cards.length} ${cards.length === 1 ? "insight" : "insights"}`}
        </p>
      }
    >
      {cards.map((card, i) => (
        <li key={String(card.href)}>
          <BlogCard
            {...card}
            className="p-0!"
            titleAs="h2"
            // `/blog/[slug]` isn't built yet; viewport prefetches would 404 for every card.
            prefetch={false}
            imageLoader={sanityImageLoader}
            imageSizes={BLOG_CARD_IMAGE_SIZES}
            imageLoading={i < BLOG_EAGER_IMAGE_COUNT ? "eager" : "lazy"}
            imageFetchPriority={i === 0 ? "high" : undefined}
          />
        </li>
      ))}
    </BlogsGridLayout>
  );
};

export default BlogsGrid;
