import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionElement = "section" | "div" | "header" | "footer" | "article" | "aside";

type Props = {
  as?: SectionElement;
  container?: boolean;
  containerClassName?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "children">;

const Section: React.FC<Props> = ({
  as: Tag = "section",
  container,
  containerClassName,
  children,
  ...rest
}) => {
  return (
    <Tag {...rest}>
      {container ? (
        <div
          className={cn("app-container border-hairline relative px-4 md:px-5", containerClassName)}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
};

export default Section;
