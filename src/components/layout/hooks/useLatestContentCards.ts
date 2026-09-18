"use client";

import { useCallback, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { preloadBlogCardImage } from "@/components/ui/cards/BlogCard";
import { blogPostsQueryOptions, selectLatestBlogPost } from "@/lib/blog/queries";
import { resourcesQueryOptions, selectLatestResource } from "@/lib/resources/queries";
import { toBlogCard } from "@/lib/blog/utils";
import { toResourceCard } from "@/lib/resources/utils";
import { sanityImageLoader } from "@/lib/sanity/image";
import type { INavLinkCard } from "@/types";

// The header reads the same query cache as the /blog and /resources pages, so neither side refetches
// what the other loaded.
//
// Nothing here may observe those queries during the initial render: the header sits above the
// pages' HydrationBoundary, and a query that already exists in the cache (even empty) is hydrated in
// an effect instead of during render, which would server-render the grids in their loading state.
// So intent prefetches imperatively, and `useLatestContentCards` only mounts inside the open panel.

/** Returns a handler that fetches the latest post and resource and warms their card images. */
export const usePrefetchLatestContent = (): (() => void) => {
  const queryClient = useQueryClient();
  const hasPrefetched = useRef<boolean>(false);

  return useCallback(() => {
    if (hasPrefetched.current) return;
    hasPrefetched.current = true;

    const warm = (card: INavLinkCard | undefined) =>
      card?.img && preloadBlogCardImage(card.img, sanityImageLoader);

    void queryClient.fetchQuery(blogPostsQueryOptions).then(
      (posts) => {
        const latest = selectLatestBlogPost(posts);
        warm(latest && toBlogCard(latest, "all"));
      },
      () => {},
    );
    void queryClient.fetchQuery(resourcesQueryOptions).then(
      (resources) => {
        const latest = selectLatestResource(resources);
        warm(latest && toResourceCard(latest));
      },
      () => {},
    );
  }, [queryClient]);
};

/** Latest blog post and latest resource as dropdown cards; `undefined` entries are still loading. */
export const useLatestContentCards = (): (INavLinkCard | undefined)[] => {
  const { data: latestPost } = useQuery({ ...blogPostsQueryOptions, select: selectLatestBlogPost });
  const { data: latestResource } = useQuery({
    ...resourcesQueryOptions,
    select: selectLatestResource,
  });

  return useMemo(
    () => [
      latestPost && toBlogCard(latestPost, "all"),
      latestResource && toResourceCard(latestResource),
    ],
    [latestPost, latestResource],
  );
};
