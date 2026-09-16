"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type {
  IFounderBook,
  IFounderBookCollage,
  IFounderBookImage,
  IFounderBookScrap,
} from "@/types";
import { createFounderBook } from "./founderBook.core.js";
import type { FounderBookHandle, FounderBookOptions } from "./founderBook.core.js";
import styles from "./FounderBook.module.css";

export type FounderBookShaderProps = Partial<FounderBookOptions> & {
  content: IFounderBook;
  className?: string;
  style?: React.CSSProperties;
};

const BookImage: React.FC<{ img: IFounderBookImage; className?: string }> = ({
  img,
  className,
}) => (
  <Image
    src={img.url}
    alt={img.alt}
    width={img.width}
    height={img.height}
    sizes={img.sizes}
    draggable={false}
    className={className}
  />
);

const Scrap: React.FC<{ scrap: IFounderBookScrap }> = ({ scrap }) => (
  <figure
    className={cn(styles.scrap, styles[scrap.kind])}
    tabIndex={0}
    role="group"
    aria-label={scrap.label}
    data-book-draggable
  >
    <BookImage img={scrap.img} />
  </figure>
);

const Collage: React.FC<{ collage: IFounderBookCollage }> = ({ collage }) => (
  <article className={cn(styles.page, styles.collage)} aria-label={collage.label}>
    <span className={styles.tinyNote}>{collage.note}</span>
    <div className={styles.scraps}>
      <Scrap scrap={collage.photo} />
      {collage.eggs.map((egg) => (
        <div
          key={egg.kind}
          className={cn(styles.easterEgg, styles[egg.kind])}
          tabIndex={0}
          role="group"
          aria-label={egg.label}
          data-book-draggable
        >
          <span>{egg.tag}</span>
          <p>
            {egg.lines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        </div>
      ))}
      {collage.scraps.map((scrap) => (
        <Scrap key={scrap.kind} scrap={scrap} />
      ))}
      <BookImage img={collage.stamp} className={styles.stamp} />
      <div className={styles.annotation}>
        <svg viewBox="0 0 170 40" aria-hidden="true">
          <path d="M4 28 C 40 13, 83 37, 155 9 M143 5 L157 9 L147 21" />
        </svg>
        <span>{collage.annotation}</span>
      </div>
    </div>
  </article>
);

export default function FounderBookShader({
  content,
  className,
  style,
  ...options
}: FounderBookShaderProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<FounderBookHandle | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    if (!hostRef.current) return;
    const book = createFounderBook(hostRef.current, optionsRef.current);
    handleRef.current = book;
    return () => {
      book.destroy();
      handleRef.current = null;
    };
  }, []);

  useEffect(() => {
    optionsRef.current = options;
    handleRef.current?.setOptions(options);
  });

  return (
    <div ref={hostRef} className={cn(styles.root, className)} style={style}>
      <div className={styles.stage}>
        <div className={styles.book} data-book>
          <section
            className={styles.spread}
            aria-label={content.spreadLabel}
            aria-hidden="true"
            inert
            data-book-spread
          >
            <article className={cn(styles.page, styles.letter)}>
              <h3 className={styles.heading}>{content.heading}</h3>
              <div className={styles.founderCopy}>
                {content.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className={styles.signoff}>
                <div>
                  <div className={styles.signature}>{content.author.name}</div>
                  <span>{content.author.role}</span>
                </div>
                <BookImage img={content.author.portrait} className={styles.portrait} />
              </div>
            </article>
            <div className={styles.mobileScrapbook}>
              <Collage collage={content.collage} />
            </div>
          </section>

          <div className={styles.cover}>
            <div className={styles.coverFace} data-book-face>
              <span className={styles.coverEdition}>
                {content.edition}
                <span>{content.established}</span>
              </span>
              <div className={styles.coverTitle}>
                <BookImage img={content.logo} className={styles.coverMark} />
                <h2 className={styles.coverHeading}>
                  {content.title[0]}
                  <br />
                  <em>{content.title[1]}</em>
                </h2>
              </div>
              <BookImage img={content.skyline} className={styles.coverSkyline} />
              <span className={styles.coverScroll}>
                {content.scrollHint} <span aria-hidden="true">↓</span>
              </span>
            </div>
            <div className={styles.coverBack} aria-hidden="true" inert data-book-back>
              <Collage collage={content.collage} />
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only" aria-live="polite" data-book-status>
        Book closed.
      </span>
    </div>
  );
}
