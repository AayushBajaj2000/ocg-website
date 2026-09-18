import { cache } from "react";
import { QueryClient, isServer } from "@tanstack/react-query";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Above 0 so data hydrated from the server isn't refetched immediately on the client.
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  });

// Server: one client per request (React `cache` scopes it to the render). Browser: a module
// singleton, so the cache survives client-side navigation until a full reload.
const getServerQueryClient = cache(makeQueryClient);

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  if (isServer) return getServerQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};
