export const withBasePath = (src: string): string => {
  const isRootRelative = src.startsWith("/") && !src.startsWith("//");
  return isRootRelative ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}` : src;
};
