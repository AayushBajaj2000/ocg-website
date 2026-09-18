import BlogCardSkeleton from "@/components/ui/cards/BlogCardSkeleton";
import { BLOG_SKELETON_COUNT } from "@/lib/constants/blog";

/** `<li>` placeholders for the grid; shown while posts are fetched in the browser. */
export const BlogCardSkeletons: React.FC = () =>
  Array.from({ length: BLOG_SKELETON_COUNT }, (_, i) => (
    <li key={i}>
      <BlogCardSkeleton className="p-0!" />
    </li>
  ));

export const BlogsLoadingStatus: React.FC = () => (
  <p role="status" className="sr-only">
    Loading insights…
  </p>
);
