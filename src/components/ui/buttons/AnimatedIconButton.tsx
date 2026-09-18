import type { ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import { SweepText } from "@/components/ui/animations/SweepText";

type AnimatedIconButtonProps = {
  href?: LinkProps["href"];
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  className?: string;
  containerClassName?: string;
  /** Opens `href` in a new tab (and says so to screen readers). */
  external?: boolean;
};

const EASE = "ease-[cubic-bezier(.83,0,.17,1)]";
const DURATION = "transition-transform duration-700";

/**
 * Rest: [label][icon] — icon visible on the right.
 * Hover: the right icon spins away (scale 1->0, rotate 0->-90) while a
 * mirrored icon on the left spins in (scale 0->1, rotate 90->0) and the
 * label slides right to open up room for it, ending at [icon][label]. At the
 * same time a contrasting colour wipes across the label from left to right.
 *
 * Both icon boxes always reserve their layout space. The label closes that
 * gap with a negative margin (not a transform) so it's a real layout shift —
 * a transform-only shift leaves the right icon at its untransformed flow
 * position, opening a gap 44px too wide at rest.
 *
 * The left icon grows from its own left edge (origin-left), not its center
 * — with the default center origin, a growing box expands both directions
 * at once, so its trailing edge briefly outruns the label's advancing edge
 * (it's still ahead of the label until ~83% through the transition) and
 * visibly overlaps it. Growing from the left edge keeps its trailing edge
 * strictly behind the label's the whole way.
 *
 * Every state is driven by `group-hover`/`group-focus-visible` off the anchor,
 * so this is a Server Component — no hover state, no client bundle.
 */
export function AnimatedIconButton({
  href,
  type,
  disabled,
  icon,
  label,
  className = "bg-brand-blue text-white",
  containerClassName,
  external,
}: AnimatedIconButtonProps) {
  if (href)
    return (
      <Link
        href={href}
        aria-label={external ? `${label} (opens in a new tab)` : label}
        className="group flex items-center gap-1"
        {...(external && { target: "_blank", rel: "noopener noreferrer", prefetch: false })}
      >
        <span
          className={`flex size-10 scale-0 rotate-90 items-center justify-center group-hover:scale-100 group-hover:rotate-180 ${DURATION} ${EASE} ${className}`}
        >
          {icon}
        </span>

        <span
          className={`text-button inline-flex h-10 items-center justify-center px-4 font-normal tracking-[-0.0175rem] transition-[margin] duration-700 group-hover:ml-0 group-focus-visible:ml-0 ${EASE} -ml-11 group-hover:-mr-11 group-hover:ml-0 ${className} ${containerClassName}`}
        >
          <SweepText>{label}</SweepText>
        </span>

        <span
          className={`flex size-10 scale-100 items-center justify-center ${DURATION} ${EASE} group-hover:scale-0 group-hover:-rotate-90 ${className}`}
        >
          {icon}
        </span>
      </Link>
    );
  else
    return (
      <button
        type={type}
        disabled={disabled}
        aria-label={label}
        className="group flex cursor-pointer items-center gap-1 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={`flex size-10 scale-0 rotate-90 items-center justify-center group-hover:scale-100 group-hover:rotate-180 ${DURATION} ${EASE} ${className}`}
        >
          {icon}
        </span>

        <span
          className={`text-button inline-flex h-10 items-center justify-center px-4 font-normal tracking-[-0.0175rem] transition-[margin] duration-700 group-hover:ml-0 group-focus-visible:ml-0 ${EASE} -ml-11 group-hover:-mr-11 group-hover:ml-0 ${className} ${containerClassName}`}
        >
          <SweepText>{label}</SweepText>
        </span>

        <span
          className={`flex size-10 scale-100 items-center justify-center ${DURATION} ${EASE} group-hover:scale-0 group-hover:-rotate-90 ${className}`}
        >
          {icon}
        </span>
      </button>
    );
}
