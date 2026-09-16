"use client";

import { useState } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { INavLinkCard, INavLinkCardIcon } from "@/types";
import { FileIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type Props = INavLinkCard;

const IMAGE_WIDTH = 320;

const imageOptions = {
  width: IMAGE_WIDTH,
  height: 198,
  sizes: `${IMAGE_WIDTH}px`,
} as const;

const icons: Record<INavLinkCardIcon, React.ReactNode> = {
  file: <FileIcon />,
};

export const preloadHeaderLinkCardImage = ({ url, alt }: INavLinkCard["img"]): void => {
  const { props } = getImageProps({ src: url, alt, ...imageOptions });
  const image = new window.Image();

  image.decoding = "async";
  if (props.sizes) image.sizes = props.sizes;
  if (props.srcSet) image.srcset = props.srcSet;
  image.src = props.src;
};

const HeaderLinkCard: React.FC<Props> = ({ href, img, category, headline, title, caption }) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  return (
    <Link href={href} className="group flex w-full flex-col gap-2 p-5">
      <span className="relative block aspect-320/198 w-full overflow-hidden bg-neutral-100">
        {!isImageLoaded && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-neutral-200 motion-reduce:animate-none"
          />
        )}
        <Image
          src={img.url}
          alt={img.alt}
          {...imageOptions}
          loading="eager"
          onLoad={() => setIsImageLoaded(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-[opacity,scale] duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none",
            isImageLoaded ? "opacity-100" : "opacity-0",
          )}
        />
        <span className="text-brand-blue font-switzer absolute top-2.5 left-2.5 bg-neutral-200 px-2 py-1 text-xs font-medium tracking-[-2%]">
          {category}
        </span>
      </span>
      <span className="text-black-3 flex items-center gap-1.5">
        {headline?.icon && icons[headline.icon]}
        <span className="font-jetbrains-mono text-xs tracking-[4%]">{headline?.text}</span>
      </span>
      <span className="text-black-1 font-switzer line-clamp-2 text-base font-medium tracking-[-1%]">
        {title}
      </span>
      <span className="text-black-3 font-switzer flex items-center gap-2 text-xs">
        {caption?.authorName && caption?.authorName}
        {caption?.authorName && caption?.readTime && (
          <span className="bg-black-3 size-1 rounded-full" />
        )}
        {caption?.readTime && caption.readTime}
        {caption?.text && (
          <span className="text-black-1 group-hover:text-brand-blue group-focus-visible:text-brand-blue underline underline-offset-2 transition-colors duration-300">
            {caption.text}
          </span>
        )}
      </span>
    </Link>
  );
};

export default HeaderLinkCard;
