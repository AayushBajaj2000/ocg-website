import BlogHero from "@/app/blog/_components/BlogHero";
import BlogsFeed from "@/app/blog/_components/BlogsFeed";

// No Suspense around the feed: the page is statically generated, so awaiting the prefetch bakes the
// cards straight into the HTML. A boundary here would prerender the skeleton first and swap the
// cards in afterwards, which delays LCP on every load. The skeleton covers client-side fetches.
const Blogs: React.FC = () => {
  return (
    <>
      <BlogHero />
      <BlogsFeed />
    </>
  );
};

export default Blogs;
