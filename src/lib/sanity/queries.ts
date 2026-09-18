import { defineQuery } from "groq";

/** Projection for an image field's dereferenced asset; normalized by `toSanityImage`. */
const SANITY_IMAGE_PROJECTION = `{
  url,
  altText,
  "lqip": metadata.lqip,
  "width": metadata.dimensions.width,
  "height": metadata.dimensions.height
}`;

// Card fields only: author and image asset are dereferenced in the same round trip, and reading
// time is derived from the body on Sanity's side (chars / 5 / 180wpm, matching the official site)
// so `pageContent` never leaves the content lake.
export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)] | order(createdAt desc, _createdAt desc) {
    "id": _id,
    "slug": slug.current,
    title,
    "publishedAt": coalesce(createdAt, _createdAt),
    "tags": coalesce(tags, []),
    "author": author->name,
    "readingTime": math::max([1, round(length(pt::text(pageContent)) / 5 / 180)]),
    "image": image.asset->${SANITY_IMAGE_PROJECTION}
  }
`);

// Everything the card and its popup need in one request: the list is small, so opening a resource
// never triggers a second fetch. `license` is flattened to plain text ("MIT").
export const RESOURCES_QUERY = defineQuery(`
  *[_type == "resources" && defined(slug.current)] | order(_createdAt desc) {
    "id": _id,
    "slug": slug.current,
    title,
    description,
    category,
    subCategory,
    "downloadUrl": downloadURL,
    "license": pt::text(license),
    "overview": coalesce(overview, []),
    "image": image.asset->${SANITY_IMAGE_PROJECTION},
    "preview": preview.asset->${SANITY_IMAGE_PROJECTION}
  }
`);
