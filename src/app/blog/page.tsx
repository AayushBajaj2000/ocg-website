import { Metadata } from "next";
import Blogs from "@/app/blog/_components/Blogs";

const DESCRIPTION =
  "Field notes on design, development, and AI from OpenCore Group – what we're building, what we're learning, and what actually moves a business forward.";

export const metadata: Metadata = {
  title: "Blog | OpenCore Group",
  description: DESCRIPTION,
  openGraph: {
    title: "Blog | OpenCore Group",
    description: DESCRIPTION,
    type: "website",
  },
};

// ISR: statically generated, refreshed at most hourly. Must be a literal for Next's static
// analysis — keep in sync with SANITY_REVALIDATE_SECONDS.
export const revalidate = 3600;

const BlogPage = () => <Blogs />;

export default BlogPage;
