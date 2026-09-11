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
    "w-full py-5 bg-white flex items-center justify-center gap-4 text-black font-switzer md:text-xl text-base",
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
