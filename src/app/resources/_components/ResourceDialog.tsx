"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { ArrowIcon, FileIcon, PlusIcon } from "@/components/icons";
import { AnimatedIconButton } from "@/components/ui/buttons/AnimatedIconButton";
import PortableContent from "@/components/ui/misc/PortableContent";
import { useScrollLock } from "@/components/layout/hooks/useScrollLock";
import { getResourceFileLabel } from "@/lib/resources/utils";
import { sanityImageLoader } from "@/lib/sanity/image";
import type { IResource, ISanityImage, PortableTextComponents } from "@/types";

type Props = {
  /** The resource to show; `undefined` closes the dialog. */
  resource: IResource | undefined;
  onClose: () => void;
};

const overviewComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-black-2 text-sm leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-black-2 flex list-disc flex-col gap-1.5 pl-5 text-sm">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="text-black-2 flex list-decimal flex-col gap-1.5 pl-5 text-sm">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-black-1 font-medium">{children}</strong>,
  },
};

const ResourceImage: React.FC<{ image: ISanityImage; sizes: string; className?: string }> = ({
  image,
  sizes,
  className,
}) => (
  <Image
    src={image.url}
    alt={image.alt}
    width={image.width ?? 1600}
    height={image.height ?? 900}
    sizes={sizes}
    loader={sanityImageLoader}
    placeholder={image.blurDataURL ? "blur" : "empty"}
    blurDataURL={image.blurDataURL}
    className={className}
  />
);

/**
 * Resource popup: overview on the left, the tall preview on the right, download at the bottom.
 * A native modal <dialog> provides focus trapping, Esc to close, inert background and the top
 * layer; Tailwind's `starting:`/`transition-discrete` animate it in and out without JS.
 */
const ResourceDialog: React.FC<Props> = ({ resource, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  // Keep the last resource rendered while the dialog animates out.
  const [shown, setShown] = useState(resource);
  if (resource && resource !== shown) setShown(resource);

  const isOpen = Boolean(resource);
  useScrollLock(isOpen);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      // Otherwise the browser focuses the first focusable node, which is a scroll container.
      closeButtonRef.current?.focus();
    } else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // A click whose target is the <dialog> itself landed on the backdrop, outside the panel.
  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const fileLabel = shown && getResourceFileLabel(shown);
  const chips = [shown?.category, shown?.subCategory].filter(Boolean);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={() => isOpen && onClose()}
      onClick={closeOnBackdrop}
      className="border-hairline shadow-header-dropdown m-auto h-[min(100dvh-2rem,46rem)] max-h-none w-[min(100vw-2rem,70rem)] max-w-none translate-y-4 overflow-hidden border bg-white p-0 opacity-0 transition-[opacity,translate,overlay,display] transition-discrete duration-300 ease-out backdrop:bg-black/50 backdrop:opacity-0 backdrop:transition-[opacity,overlay,display] backdrop:transition-discrete backdrop:duration-300 open:translate-y-0 open:opacity-100 open:backdrop:opacity-100 motion-reduce:transition-none motion-reduce:backdrop:transition-none starting:open:translate-y-4 starting:open:opacity-0 starting:open:backdrop:opacity-0"
    >
      {shown && (
        <div className="grid size-full grid-rows-[auto_minmax(0,1fr)] md:grid-cols-2 md:grid-rows-1">
          <div className="bg-sunken border-b-hairline md:border-l-hairline relative h-48 overflow-hidden border-b md:order-last md:h-auto md:overflow-y-auto md:overscroll-contain md:border-b-0 md:border-l">
            {shown.image && (
              <ResourceImage
                image={shown.image}
                sizes="100vw"
                className="size-full object-cover md:hidden"
              />
            )}
            {shown.preview && (
              <ResourceImage
                image={shown.preview}
                sizes="(min-width: 70rem) 35rem, 50vw"
                className="hidden h-auto w-full md:block"
              />
            )}
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-5 py-6 md:px-8 md:py-8">
              <div className="flex flex-wrap items-center gap-2 pr-10">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="text-brand-blue font-switzer bg-neutral-200 px-2 py-1 text-xs font-medium tracking-[-2%]"
                  >
                    {chip}
                  </span>
                ))}
                {fileLabel && (
                  <span className="text-black-3 flex items-center gap-1.5">
                    <FileIcon />
                    <span className="font-jetbrains-mono text-xs tracking-[4%]">{fileLabel}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <h2
                  id={titleId}
                  className="text-black-1 font-switzer text-2xl font-medium tracking-[-2%] md:text-3xl"
                >
                  {shown.title}
                </h2>
                <p id={descriptionId} className="text-black-3 font-switzer text-sm md:text-base">
                  {shown.description}
                </p>
              </div>
              {shown.overview.length > 0 && (
                <section aria-label="Overview" className="font-switzer flex flex-col gap-3">
                  <h3 className="text-black-3 font-jetbrains-mono text-xs tracking-[6%] uppercase">
                    Overview
                  </h3>
                  <PortableContent value={shown.overview} components={overviewComponents} />
                </section>
              )}
              {shown.license && (
                <p className="text-black-3 font-switzer text-xs">
                  License: <span className="text-black-1">{shown.license}</span>
                </p>
              )}
            </div>

            {shown.downloadUrl && (
              <div className="border-t-hairline border-t px-5 py-4 md:px-8">
                <AnimatedIconButton
                  href={shown.downloadUrl}
                  label="Download files"
                  icon={<ArrowIcon className="size-4 rotate-90" />}
                  external
                />
              </div>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-black-1 focus-visible:outline-brand-blue absolute top-3 right-3 grid size-10 cursor-pointer place-content-center border border-neutral-200 bg-white transition-colors duration-300 outline-none hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none md:top-4 md:right-4"
          >
            <PlusIcon className="size-5 rotate-45" />
          </button>
        </div>
      )}
    </dialog>
  );
};

export default ResourceDialog;
