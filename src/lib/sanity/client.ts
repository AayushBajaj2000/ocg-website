import "server-only";
import { createClient, type SanityClient } from "@sanity/client";
import { getSanityEnv } from "@/lib/env/server";

let client: SanityClient | null = null;

// Server-only: the dataset rejects browser origins, and keeping the client off the client bundle
// saves its weight on every page. Read-only and tokenless; `published` keeps drafts out without
// filtering in every query. Lazy so a missing env var fails the request, not module evaluation.
export const getSanityClient = (): SanityClient => {
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
