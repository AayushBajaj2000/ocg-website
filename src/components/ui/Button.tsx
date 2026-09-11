import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "book-call";

type ButtonProps = {
  href: string;
  variant: ButtonVariant;
  children?: ReactNode;
  "aria-label"?: string;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  "book-call":
    "w-full md:py-5 py-4 bg-white flex items-center justify-center gap-4 text-black font-switzer md:text-xl text-base before:w-full before:h-auto before:transition-all before:ease-in-out before:duration-300 transition-all ease-in-out duration-300 before:bg-brand-blue before:content-[''] before:absolute before:left-0 before:bottom-0 before:-z-1 relative z-10 hover:text-white before:rotate-90",
};

export function Button({
  href,
  variant = "book-call",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <Link href={href} className={`${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
