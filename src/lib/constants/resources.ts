export const RESOURCES_PATH = "/resources";

export const RESOURCES_API_PATH = "/api/resources";

/** Search param that opens a resource's popup, so a resource is linkable from anywhere. */
export const RESOURCE_QUERY_PARAM = "resource";

export const resourceHref = (slug: string) =>
  `${RESOURCES_PATH}?${RESOURCE_QUERY_PARAM}=${encodeURIComponent(slug)}`;

/** File-type label shown on the card, keyed by the CMS `subCategory` (lowercased). */
export const RESOURCE_FILE_EXTENSIONS: Record<string, string> = {
  figma: ".fig",
};

export const RESOURCE_CARD_CTA = "Get it →";
