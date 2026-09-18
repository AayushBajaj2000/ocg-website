"use client";

import { useState } from "react";
import Image, { getImageProps, type ImageProps } from "next/image";
import Link, { type LinkProps } from "next/link";
import { INavLinkCard, INavLinkCardIcon, INavLinkCardImage } from "@/types";
import { FileIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type Props = INavLinkCard & {
  titleAs?: "span" | "h2" | "h3";
  prefetch?: LinkProps["prefetch"];
  imageSizes?: string;
  imageLoading?: ImageProps["loading"];
  imageFetchPriority?: ImageProps["fetchPriority"];
  imageLoader?: ImageProps["loader"];
};

const IMAGE_WIDTH = 320;

const imageOptions = {
  width: IMAGE_WIDTH,
  height: 198,
  sizes: `${IMAGE_WIDTH}px`,
} as const;

const HEADLINE_TEXT_CLASS = "font-jetbrains-mono text-xs tracking-[4%]";

const icons: Record<INavLinkCardIcon, React.ReactNode> = {
  file: <FileIcon />,
};

export const preloadBlogCardImage = ({ url, alt }: INavLinkCardImage): void => {
  const { props } = getImageProps({ src: url, alt, ...imageOptions });
  const image = new window.Image();

  image.decoding = "async";
  if (props.sizes) image.sizes = props.sizes;
  if (props.srcSet) image.srcset = props.srcSet;
  image.src = props.src;
};

const BlogCard: React.FC<Props> = ({
  href,
  img,
  category,
  headline,
  title,
  caption,
  className,
  titleAs: Title = "span",
  prefetch,
  imageSizes = imageOptions.sizes,
  imageLoading = "eager",
  imageFetchPriority,
  imageLoader,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  // With a blur preview the image is visible from the first paint; otherwise fade in once loaded.
  const hasBlur = Boolean(img?.blurDataURL);
  const showPulse = img && !hasBlur && !isImageLoaded;

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn("group flex w-full flex-col gap-2 p-5", className)}
    >
      <span className="relative block aspect-320/198 w-full overflow-hidden bg-neutral-100">
        {showPulse && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-neutral-200 motion-reduce:animate-none"
          />
        )}
        {img && (
          <Image
            src={img.url}
            alt={img.alt}
            {...imageOptions}
            sizes={imageSizes}
            loader={imageLoader}
            loading={imageLoading}
            fetchPriority={imageFetchPriority}
            placeholder={hasBlur ? "blur" : "empty"}
            blurDataURL={img.blurDataURL}
            onLoad={hasBlur ? undefined : () => setIsImageLoaded(true)}
            className={cn(
              "absolute inset-0 size-full object-cover transition-[opacity,scale] duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none",
              hasBlur || isImageLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        {category && (
          <span className="text-brand-blue font-switzer absolute top-2.5 left-2.5 bg-neutral-200 px-2 py-1 text-xs font-medium tracking-[-2%]">
            {category}
          </span>
        )}
      </span>
      <span className="text-black-3 flex items-center gap-1.5">
        {headline?.icon && icons[headline.icon]}
        {headline?.dateTime ? (
          <time dateTime={headline.dateTime} className={HEADLINE_TEXT_CLASS}>
            {headline.text}
          </time>
        ) : (
          <span className={HEADLINE_TEXT_CLASS}>{headline?.text}</span>
        )}
      </span>
      <Title className="text-black-1 font-switzer line-clamp-2 text-base font-medium tracking-[-1%]">
        {title}
      </Title>
      <span className="text-black-3 font-switzer flex items-center gap-2 text-xs">
        {caption?.authorName}
        {caption?.authorName && caption?.readTime && (
          <span aria-hidden="true" className="bg-black-3 size-1 rounded-full" />
        )}
        {caption?.readTime}
        {caption?.text && (
          <span className="text-black-1 group-hover:text-brand-blue group-focus-visible:text-brand-blue underline underline-offset-2 transition-colors duration-300">
            {caption.text}
          </span>
        )}
      </span>
    </Link>
  );
};

export default BlogCard;
