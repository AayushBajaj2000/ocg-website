"use client";

import type { MouseEvent, ReactNode } from "react";
import Section from "@/components/layout/sections/Section";
import BlogCard from "@/components/ui/cards/BlogCard";
import BlogCardSkeleton from "@/components/ui/cards/BlogCardSkeleton";
import { sanityImageLoader } from "@/lib/sanity/image";
import {
  CARD_GRID_EAGER_IMAGE_COUNT,
  CARD_GRID_IMAGE_SIZES,
  CARD_GRID_SKELETON_COUNT,
} from "@/lib/constants/cards";
import type { INavLinkCard } from "@/types";

type Props = {
  /** Accessible name of the section, e.g. "Insights". */
  label: string;
  /** Cards to render; `undefined` while the data is still loading (renders skeletons). */
  cards: INavLinkCard[] | undefined;
  isError?: boolean;
  filter?: ReactNode;
  /** Used in the screen-reader result count: "Showing 3 insights". */
  noun: { one: string; other: string };
  emptyMessage: string;
  errorMessage: string;
  /** Called with the card's index in `cards`. */
  onCardClick?: (event: MouseEvent<HTMLAnchorElement>, index: number) => void;
};

const STATUS_CLASS = "text-black-2 text-center text-sm";

/**
 * Content card grid shared by the blog and resources pages: filter slot, live status line, and a
 * responsive grid of BlogCards with Sanity-optimized images. While `cards` is undefined it renders
 * layout-matched skeletons in the same shell, so swapping in the real cards causes no shift.
 */
const CardGridSection: React.FC<Props> = ({
  label,
  cards,
  isError,
  filter,
  noun,
  emptyMessage,
  errorMessage,
  onCardClick,
}) => {
  const isPending = cards === undefined && !isError;
  const message = isError ? errorMessage : cards?.length === 0 ? emptyMessage : null;

  const status = isPending
    ? `Loading ${noun.other}…`
    : (message ?? `Showing ${cards?.length} ${cards?.length === 1 ? noun.one : noun.other}`);

  return (
    <Section
      as="section"
      aria-label={label}
      aria-busy={isPending || undefined}
      container
      containerClassName="flex flex-col md:gap-12 gap-8 md:pb-16 pb-10 border-x"
    >
      {filter}
      <p role="status" className={message ? STATUS_CLASS : "sr-only"}>
        {status}
      </p>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-3"
      >
        {isPending
          ? Array.from({ length: CARD_GRID_SKELETON_COUNT }, (_, i) => (
              <li key={i}>
                <BlogCardSkeleton className="p-0!" />
              </li>
            ))
          : cards?.map((card, i) => (
              <li key={String(card.href)}>
                <BlogCard
                  {...card}
                  className="p-0!"
                  titleAs="h2"
                  // Detail routes aren't built yet (resources open in a popup); viewport
                  // prefetches would 404 for every card.
                  prefetch={false}
                  onClick={onCardClick && ((event) => onCardClick(event, i))}
                  imageLoader={sanityImageLoader}
                  imageSizes={CARD_GRID_IMAGE_SIZES}
                  imageLoading={i < CARD_GRID_EAGER_IMAGE_COUNT ? "eager" : "lazy"}
                  imageFetchPriority={i === 0 ? "high" : undefined}
                />
              </li>
            ))}
      </ul>
    </Section>
  );
};

export default CardGridSection;
