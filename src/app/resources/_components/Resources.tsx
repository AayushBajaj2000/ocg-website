import ResourcesHero from "@/app/resources/_components/ResourcesHero";
import ResourcesFeed from "@/app/resources/_components/ResourcesFeed";

// No Suspense around the feed: awaiting the prefetch bakes the cards into the static HTML.
const Resources: React.FC = () => {
  return (
    <>
      <ResourcesHero />
      <ResourcesFeed />
    </>
  );
};

export default Resources;
