import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { BLOG_POSTS_API_PATH } from "@/lib/constants/blog";
import type { IBlogPost } from "@/types";

const fetchBlogPostsFromApi = async (): Promise<IBlogPost[]> => {
  const response = await fetch(BLOG_POSTS_API_PATH);
  if (!response.ok) throw new Error(`Failed to load blog posts (${response.status})`);
  return response.json();
};

// Shared by the server prefetch (which swaps in a direct Sanity `queryFn`) and the client
// `useQuery`. The browser only runs this `queryFn` if the server prefetch failed. Infinite
// stale/gc time: once cached, posts are never refetched or collected until a full reload.
export const blogPostsQueryOptions = queryOptions({
  queryKey: queryKeys.blog.posts(),
  queryFn: fetchBlogPostsFromApi,
  staleTime: Infinity,
  gcTime: Infinity,
});
