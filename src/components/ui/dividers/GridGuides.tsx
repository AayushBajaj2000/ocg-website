/**
 * Decorative vertical column guides. Figma builds these as one continuous
 * line running the full height of the page (Hero -> Trusted By -> Stats and
 * beyond), not one per section — so this renders once, positioned against a
 * page-level `relative` wrapper (see `src/app/page.tsx`) that spans every
 * section, rather than inside an individual section. Rendering it inside
 * each section independently was the earlier bug: `inset-y-0` only stretches
 * to the nearest positioned ancestor, so a per-section copy can only ever
 * span that one section, leaving a gap in whichever section forgot a copy.
 *
 * Figma pins these 145px from the *canvas* edge (1728px wide), which only
 * clears the content column because that canvas is much wider than the
 * 1397px content max-width. A fixed 145px from the *viewport* edge doesn't
 * hold at realistic browser widths in between (e.g. ~1440-1512px laptops)
 * — the content column's own margin shrinks well under 145px there, so the
 * line lands on top of the logo/headline instead of beside it. Guides stay
 * flush with the content edges (matching the 16px mobile treatment) until
 * the viewport is wide enough to fit the true Figma inset without overlap.
 *
 * z-10 (rather than sitting behind, as it did per-section) because it's now
 * rendered after every section in DOM order, on top of their own opaque
 * backgrounds, instead of as a descendant behind each section's own content.
 */
export function GridGuides() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      <div className="bg-hairline absolute inset-y-0 left-4 w-px min-[108rem]:left-36.25" />
      <div className="bg-hairline absolute inset-y-0 right-4 w-px min-[108rem]:right-36.25" />
    </div>
  );
}
