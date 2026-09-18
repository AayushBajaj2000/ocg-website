import type { MouseEvent } from "react";
import {
  RESOURCE_CARD_CTA,
  RESOURCE_FILE_EXTENSIONS,
  RESOURCE_QUERY_PARAM,
  resourceHref,
} from "@/lib/constants/resources";
import type { INavLinkCard, IResource } from "@/types";

export const getResourceFileLabel = ({ subCategory }: IResource): string | undefined =>
  subCategory && (RESOURCE_FILE_EXTENSIONS[subCategory.toLowerCase()] ?? subCategory);

/** Maps a resource onto BlogCard's downloadable-file layout (file icon, type, "Get it" CTA). */
export const toResourceCard = (resource: IResource): INavLinkCard => ({
  href: resourceHref(resource.slug),
  img: resource.image,
  category: resource.subCategory ?? resource.category,
  headline: { icon: "file", text: getResourceFileLabel(resource) },
  title: resource.title,
  caption: { text: RESOURCE_CARD_CTA },
});

// The popup is driven by `?resource=<slug>` so it's linkable (e.g. from the header) and closes on
// Back. Next syncs `useSearchParams` with the native History API, so no server round trip happens.
let openedFromPage = false;

const writeResourceParam = (slug: string | null, method: "pushState" | "replaceState") => {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(RESOURCE_QUERY_PARAM, slug);
  else url.searchParams.delete(RESOURCE_QUERY_PARAM);
  window.history[method](null, "", url);
};

export const openResourcePopup = (slug: string): void => {
  openedFromPage = true;
  writeResourceParam(slug, "pushState");
};

/** Pops the entry we pushed; a deep-linked popup (landed on directly) just drops the param. */
export const closeResourcePopup = (): void => {
  if (openedFromPage) {
    openedFromPage = false;
    window.history.back();
  } else writeResourceParam(null, "replaceState");
};

/** Lets modified clicks (new tab/window) fall through to the card's real link. */
export const isPlainLeftClick = (event: MouseEvent): boolean =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
