import "server-only";
import { sanityFetch } from "@/lib/sanity/client";
import { toSanityImage } from "@/lib/sanity/image";
import { RESOURCES_QUERY } from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/constants/sanity";
import type { IResource, SanityResource } from "@/types";

const normalizeResource = (resource: SanityResource): IResource => ({
  id: resource.id,
  slug: resource.slug,
  title: resource.title?.trim() ?? "",
  description: resource.description?.trim() ?? "",
  category: resource.category ?? undefined,
  subCategory: resource.subCategory ?? undefined,
  downloadUrl: resource.downloadUrl ?? undefined,
  license: resource.license?.trim() || undefined,
  overview: resource.overview,
  image: toSanityImage(resource.image),
  preview: toSanityImage(resource.preview),
});

/** Queries Sanity directly. Cached by Next's data cache for the content ISR window. */
export const fetchResources = async (): Promise<IResource[]> => {
  const resources = await sanityFetch<SanityResource[]>(
    RESOURCES_QUERY,
    SANITY_CACHE_TAGS.resources,
  );
  return resources.map(normalizeResource);
};
