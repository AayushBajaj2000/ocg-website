import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import BlogsGrid from "@/app/blog/_components/BlogsGrid";
import { blogPostsQueryOptions } from "@/lib/blog/queries";
import { fetchBlogPosts } from "@/lib/blog/server";
import { getQueryClient } from "@/lib/react-query/getQueryClient";

// Queries Sanity on the server (ISR-cached) and seeds the browser QueryClient, so the cards are in
// the HTML and the browser never fetches them. A failed prefetch doesn't throw: nothing is
// dehydrated and BlogsGrid falls back to the cached `/api/blog/posts` route.
const BlogsFeed: React.FC = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({ ...blogPostsQueryOptions, queryFn: fetchBlogPosts });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogsGrid />
    </HydrationBoundary>
  );
};

export default BlogsFeed;
