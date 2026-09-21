"use client";

import Section from "@/components/layout/sections/Section";
import BlogCard from "@/components/ui/cards/BlogCard";
import { toBlogCard } from "@/lib/blog/utils";
import { CARD_GRID_IMAGE_SIZES } from "@/lib/constants";
import { sanityImageLoader } from "@/lib/sanity/image";
import type { IBlogPost } from "@/types";

const RelatedPosts: React.FC<{ posts: IBlogPost[] }> = ({ posts }) => {
  return (
    <Section
      as="section"
      aria-labelledby="related-posts-title"
      container
      containerClassName="border-x py-10 md:py-20"
    >
      <div className="mx-auto flex max-w-330 flex-col gap-8">
        <h2
          id="related-posts-title"
          className="text-hero-mobile text-black-1 font-medium tracking-[-2%] md:text-5xl md:leading-14.5"
        >
          More from the team
        </h2>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <BlogCard
                {...toBlogCard(post, "all")}
                titleAs="h3"
                imageSizes={CARD_GRID_IMAGE_SIZES}
                imageLoading="lazy"
                imageLoader={sanityImageLoader}
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default RelatedPosts;
