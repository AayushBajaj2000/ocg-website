import { Reveal } from "@/components/ui/animations/Reveal";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type Feature = {
  title: string;
  description: string;
  image: { src: string; alt: string };
};

type Variant = "app" | "assistant";

type Props = {
  features: readonly Feature[];
  /** The two phases space the rows and size the body copy differently. */
  variant: Variant;
};

const STYLES: Record<Variant, { row: string; description: string }> = {
  app: { row: "gap-4", description: "text-base md:text-xl/7.5 tracking-[-1%]" },
  assistant: { row: "gap-4 lg:gap-6", description: "text-sm md:text-base" },
};

/**
 * Numbered copy card beside a visual, alternating sides row by row from `lg`.
 * The visual keeps its 552×520 frame and the copy card stretches to match it.
 */
const FeatureRows: React.FC<Props> = ({ features, variant }) => {
  const styles = STYLES[variant];

  return (
    <div className="flex flex-col gap-4 md:gap-10">
      {features.map((f, i) => (
        <div
          key={f.title}
          className={cn("flex flex-col lg:flex-row", styles.row, {
            "lg:flex-row-reverse": i % 2 === 1,
          })}
        >
          <div className="flex flex-1 flex-col justify-between gap-10 rounded-3xl bg-neutral-50 p-6 md:p-8">
            <span className="font-switzer text-anesthesia-orange text-xl/7.5 tracking-[-1%]">
              0{i + 1}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-switzer text-lg tracking-[-1%] text-black md:text-xl/7.5">
                {f.title}
              </h3>
              <Reveal
                as="p"
                className={cn("font-switzer text-neutral-500", styles.description)}
                byLine
              >
                {f.description}
              </Reveal>
            </div>
          </div>
          <Image
            src={f.image.src}
            alt={f.image.alt}
            width={1104}
            height={1040}
            sizes="(min-width: 1024px) 552px, 100vw"
            className="w-full shrink-0 rounded-3xl object-cover lg:w-[48.94%]"
          />
        </div>
      ))}
    </div>
  );
};

export default FeatureRows;
