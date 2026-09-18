import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { fetchJson } from "@/lib/react-query/fetchJson";
import { CONTENT_QUERY_DEFAULTS } from "@/lib/react-query/contentQueryDefaults";
import { RESOURCES_API_PATH } from "@/lib/constants/resources";
import type { IResource } from "@/types";

// Shared by the server prefetch (which swaps in a direct Sanity `queryFn`) and the client
// `useQuery`. The browser only runs this `queryFn` if nothing was prefetched.
export const resourcesQueryOptions = queryOptions({
  queryKey: queryKeys.resources.list(),
  queryFn: () => fetchJson<IResource[]>(RESOURCES_API_PATH),
  ...CONTENT_QUERY_DEFAULTS,
});

export const selectLatestResource = (resources: IResource[]): IResource | undefined => resources[0];
