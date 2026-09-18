"use client";

import { m, type Variants } from "motion/react";
import BlogCard from "@/components/ui/cards/BlogCard";
import BlogCardSkeleton from "@/components/ui/cards/BlogCardSkeleton";
import { useLatestContentCards } from "@/components/layout/hooks/useLatestContentCards";
import { sanityImageLoader } from "@/lib/sanity/image";

type Props = {
  itemVariants: Variants;
};

/** "Latest from Opencore": newest blog post (left) and newest resource (right). */
const HeaderLatestCards: React.FC<Props> = ({ itemVariants }) => {
  const cards = useLatestContentCards();

  return (
    <div className="divide-hairline grid grid-cols-2 divide-x">
      {cards.map((card, i) => (
        <m.div key={i} variants={itemVariants}>
          {card ? (
            <BlogCard
              {...card}
              // `/blog/[slug]` isn't built yet; don't prefetch it.
              prefetch={false}
              imageLoader={sanityImageLoader}
            />
          ) : (
            <BlogCardSkeleton />
          )}
        </m.div>
      ))}
    </div>
  );
};

export default HeaderLatestCards;
