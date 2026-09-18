// CMS content is served from ISR, so once it's in the browser cache it's never refetched or garbage
// collected until a full reload: revisiting a page makes no requests.
export const CONTENT_QUERY_DEFAULTS = {
  staleTime: Infinity,
  gcTime: Infinity,
} as const;
