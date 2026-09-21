import { PFHeading } from "@/app/work/page-flooring/_components/platform/Outcome";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof PFHeading> & {
  /** The App & Webapp captions are semibold; the AI Assistant ones are regular. */
  captionWeight?: "regular" | "semibold";
};

/** `PFHeading` in the AnesthesiaOne palette: orange caption, slate title and body. */
const AOHeading: React.FC<Props> = ({
  captionWeight = "semibold",
  captionClassName,
  titleClassName,
  descriptionClassName,
  ...rest
}) => {
  return (
    <PFHeading
      captionClassName={cn(
        "text-anesthesia-orange! tracking-[1%]! sm:text-xs!",
        captionWeight === "semibold" ? "font-semibold!" : "font-normal!",
        captionClassName,
      )}
      titleClassName={cn("text-neutral-700", titleClassName)}
      descriptionClassName={cn(
        "text-neutral-500! tracking-[-1%]! md:text-xl/7.5!",
        descriptionClassName,
      )}
      {...rest}
    />
  );
};

export default AOHeading;
