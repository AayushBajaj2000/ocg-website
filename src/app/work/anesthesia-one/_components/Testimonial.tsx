import { cn } from "@/lib/utils";
import Image from "next/image";

type Size = "default" | "tall";

type Props = {
  quote: string;
  name: string;
  role: string;
  size?: Size;
};

const ICONS = [
  { src: "/anesthesia-one/shared/book.webp", alt: "Reference book" },
  { src: "/anesthesia-one/shared/syringe.webp", alt: "Syringe" },
  { src: "/anesthesia-one/shared/calculator.webp", alt: "Calculator" },
  { src: "/anesthesia-one/shared/drugs.webp", alt: "Medication" },
];

/** Icon badges sit on the arc, offset from the card's centre so they track it at every width. */
const ICON_POSITIONS: Record<Size, string[]> = {
  default: [
    "left-[calc(50%-25.8125rem)] top-20",
    "left-[calc(50%+22.6875rem)] top-6.5",
    "left-[calc(50%+23.0625rem)] top-70",
    "left-[calc(50%-25.3125rem)] top-67.5",
  ],
  tall: [
    "left-[calc(50%-25.03rem)] top-22.75",
    "left-[calc(50%+22.84rem)] top-22",
    "left-[calc(50%+22.84rem)] top-88",
    "left-[calc(50%-24.09rem)] top-89.75",
  ],
};

const STYLES: Record<Size, { card: string; pill: string; quote: string; name: string }> = {
  default: {
    card: "md:h-91.25",
    pill: "px-4 py-2 text-xs/[1.369rem]",
    quote: "md:text-[2rem]/12 max-w-160.75",
    name: "font-medium tracking-[-2%]",
  },
  tall: {
    card: "md:h-122.5",
    pill: "px-5.75 py-3.5 text-sm/[1.369rem]",
    quote: "md:text-2xl/9 max-w-160.75",
    name: "font-normal",
  },
};

const Testimonial: React.FC<Props> = ({ quote, name, role, size = "default" }) => {
  const styles = STYLES[size];

  return (
    <figure
      className={cn(
        "bg-anesthesia-green relative flex w-full items-center justify-center overflow-hidden rounded-3xl px-6 py-12 md:rounded-[1.46rem] md:px-10 md:py-0",
        styles.card,
      )}
    >
      <Image
        src="/anesthesia-one/shared/testimonial-arc.svg"
        alt=""
        width={816}
        height={792}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[calc(50%+0.75rem)] h-198 w-204 max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      {ICONS.map((icon, i) => (
        <div
          key={icon.src}
          aria-hidden
          className={cn(
            "absolute hidden size-13.75 place-content-center rounded-full bg-white lg:grid",
            ICON_POSITIONS[size][i],
          )}
        >
          <Image src={icon.src} alt="" width={32} height={32} className="size-8" />
        </div>
      ))}

      <div className="relative flex flex-col items-center gap-6 text-center">
        <span
          className={cn(
            "font-switzer rounded-full border-[0.73px] border-white font-medium tracking-[-1%] text-white",
            styles.pill,
          )}
        >
          ANESTHESIA ONE
        </span>
        <blockquote
          className={cn(
            "font-switzer text-xl font-semibold tracking-[-1%] text-white",
            styles.quote,
          )}
        >
          {quote}
        </blockquote>
        <figcaption className="flex flex-col items-center">
          <span className={cn("font-switzer text-base text-white", styles.name)}>{name}</span>
          <span className="font-switzer text-sm text-white/75">{role}</span>
        </figcaption>
      </div>
    </figure>
  );
};

export default Testimonial;
