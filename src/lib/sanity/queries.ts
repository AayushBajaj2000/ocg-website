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
    "image": image.asset->${SANITY_IMAGE_PROJECTION},
    "focus": image.hotspot{x, y}
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

// Card fields only. `order` ties (two members share a slot) fall back to creation date. The hotspot
// centre is where Sanity centres the crop to the card's landscape photo window.
export const TEAM_MEMBERS_QUERY = defineQuery(`
  *[_type == "teamMember" && defined(name)] | order(order asc, _createdAt asc) {
    "id": _id,
    name,
    role,
    "image": image.asset->${SANITY_IMAGE_PROJECTION},
    "focus": image.hotspot{x, y}
  }
`);

// The `faq` type has no order field, so the list follows creation order.
export const FAQS_QUERY = defineQuery(`
  *[_type == "faq" && defined(question) && defined(answer)] | order(_createdAt asc) {
    question,
    answer
  }
`);

// One document per logo in the "Trusted by" grid. The customer fields are optional: a logo without
// a testimonial renders as a plain tile. SVG logos report their drawn size as `dimensions`.
export const CUSTOMER_TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "customerTestimonial" && defined(logo.asset)] | order(order asc, _createdAt asc) {
    "id": _id,
    company,
    "logo": logo.asset->${SANITY_IMAGE_PROJECTION},
    customerName,
    customerPosition,
    testimonial,
    "photo": customerPhoto.asset->${SANITY_IMAGE_PROJECTION}
  }
`);
