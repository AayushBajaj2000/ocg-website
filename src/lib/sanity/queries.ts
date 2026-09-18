import { defineQuery } from "groq";

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
    "image": image.asset->{ url, altText, "lqip": metadata.lqip }
  }
`);
