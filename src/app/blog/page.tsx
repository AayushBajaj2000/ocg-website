import Blogs from "@/app/blog/_components/Blogs";
import { pageMetadata } from "@/lib/seo/pages";

export const metadata = pageMetadata("blog");

// ISR: statically generated, refreshed at most hourly. Must be a literal for Next's static
// analysis — keep in sync with SANITY_REVALIDATE_SECONDS.
export const revalidate = 3600;

const BlogPage = () => <Blogs />;

export default BlogPage;
