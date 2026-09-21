// ISR window for Sanity content. Route segments mirror it as a literal `revalidate` (Next requires
// a statically analyzable value there): `src/app/{blog,resources}/page.tsx` and `src/app/api/**`.
export const SANITY_REVALIDATE_SECONDS = 3600;

export const SANITY_CACHE_TAGS = {
  blog: "blogPost",
  resources: "resources",
  team: "teamMember",
  faq: "faq",
  customerTestimonials: "customerTestimonial",
} as const;
