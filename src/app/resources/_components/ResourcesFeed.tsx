import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ResourcesGrid from "@/app/resources/_components/ResourcesGrid";
import ResourceDialogController from "@/app/resources/_components/ResourceDialogController";
import { resourcesQueryOptions } from "@/lib/resources/queries";
import { fetchResources } from "@/lib/resources/server";
import { getQueryClient } from "@/lib/react-query/getQueryClient";

// Same pipeline as the blog: query Sanity on the server (ISR-cached) and seed the browser
// QueryClient, so cards are in the HTML and neither the grid nor the popup fetches in the browser.
const ResourcesFeed: React.FC = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({ ...resourcesQueryOptions, queryFn: fetchResources });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResourcesGrid />
      <Suspense fallback={null}>
        <ResourceDialogController />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ResourcesFeed;
