import "server-only";
import { createClient, type QueryParams, type SanityClient } from "@sanity/client";
import { getSanityEnv } from "@/lib/env/server";
import { SANITY_REVALIDATE_SECONDS } from "@/lib/constants/sanity";

let client: SanityClient | null = null;

// Server-only: the dataset rejects browser origins, and keeping the client off the client bundle
// saves its weight on every page. Read-only and tokenless; `published` keeps drafts out without
// filtering in every query. Lazy so a missing env var fails the request, not module evaluation.
const getSanityClient = (): SanityClient => {
  if (client) return client;

  const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } = getSanityEnv();
  client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: true,
    perspective: "published",
  });

  return client;
};

/** Runs a GROQ query through Next's data cache for the content ISR window, tagged for revalidation. */
export const sanityFetch = <T>(query: string, tag: string, params: QueryParams = {}): Promise<T> =>
  getSanityClient().fetch<T>(query, params, {
    next: { revalidate: SANITY_REVALIDATE_SECONDS, tags: [tag] },
  });
