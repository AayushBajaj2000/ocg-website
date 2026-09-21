import Link from "next/link";
import BlogBody from "@/app/blog/[slug]/_components/BlogBody";
import BlogPostCta from "@/app/blog/[slug]/_components/BlogPostCta";
import BlogToc from "@/app/blog/[slug]/_components/BlogToc";
import RelatedPosts from "@/app/blog/[slug]/_components/RelatedPosts";
import Section from "@/components/layout/sections/Section";
import PageDivider from "@/components/ui/dividers/PageDivider";
import SanityImage from "@/components/ui/misc/SanityImage";
import { BLOG_PATH } from "@/lib/constants";
import { formatBlogDate } from "@/lib/blog/utils";
import type { IBlogPost, IBlogPostDetail } from "@/types";

type Props = {
  post: IBlogPostDetail;
  related: IBlogPost[];
};

// Hero well in the design: 1437 × 520.
const HERO_ASPECT_RATIO = 1437 / 520;

const BlogPost: React.FC<Props> = ({ post, related }) => {
  const { author } = post;
  // A single entry isn't a table of contents.
  const hasToc = post.toc.length > 1;
  const byline = [author?.role && `${author.role}, OpenCore Group`, `${post.readingTime} min read`]
    .filter(Boolean)
    .join(" · ");

  return (
    <article>
      <Section as="header" container containerClassName="border-x pt-6 pb-10 md:pt-12 md:pb-16">
        <div className="mx-auto flex max-w-330 flex-col gap-6 lg:flex-row lg:gap-0">
          <div className="lg:w-41.5 lg:shrink-0">
            <Link
              href={BLOG_PATH}
              aria-label="Back to all blog posts"
              className="border-hairline font-jetbrains-mono text-black-1 hover:border-brand-blue hover:text-brand-blue focus-visible:outline-brand-blue grid size-10 place-items-center border text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span aria-hidden>&lt;-</span>
            </Link>
          </div>
          <div className="flex max-w-247 flex-col gap-5 md:gap-8 lg:pt-10">
            <time
              dateTime={post.publishedAt}
              className="font-jetbrains-mono text-black-3 text-xs tracking-[6%] uppercase"
            >
              {formatBlogDate(post.publishedAt)}
            </time>
            <h1 className="text-hero-mobile md:text-hero-desktop text-black-1 font-medium tracking-[-2%] text-balance">
              {post.title}
            </h1>
            {author && (
              <div className="flex items-center gap-3">
                {author.image && (
                  <SanityImage
                    src={author.image.url}
                    alt=""
                    width={48}
                    height={48}
                    crop={{ aspectRatio: 1 }}
                    className="bg-sunken size-10 rounded-full object-cover md:size-12"
                  />
                )}
                <div className="flex flex-col tracking-[-2%]">
                  <span className="text-black-1 text-sm font-medium md:text-base">
                    {author.name}
                  </span>
                  <span className="text-black-3 text-xs md:text-sm">{byline}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {post.image && (
        <Section container containerClassName="border-x px-0! md:px-0!">
          <div className="bg-sunken relative aspect-[1437/520] w-full">
            <SanityImage
              src={post.image.url}
              alt={post.image.alt}
              fill
              priority
              sizes="(min-width: 1440px) 1437px, 100vw"
              crop={{ aspectRatio: HERO_ASPECT_RATIO, focus: post.imageFocus }}
              placeholder={post.image.blurDataURL ? "blur" : "empty"}
              blurDataURL={post.image.blurDataURL}
              className="object-cover"
            />
          </div>
        </Section>
      )}

      <PageDivider />

      {/* `overflow-visible`: the container clips by default, which would stop the contents sticking. */}
      <Section container containerClassName="border-x py-10 md:py-15 overflow-visible!">
        {/* Without a contents rail (a post with no headings) the article centres on the page. */}
        <div className="mx-auto flex max-w-330 flex-col gap-8 lg:flex-row lg:justify-center lg:gap-16">
          {hasToc && <BlogToc items={post.toc} />}
          <div className="min-w-0 flex-1 lg:max-w-250">
            <BlogBody body={post.body} headingIds={post.headingIds} />
            <BlogPostCta />
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <>
          <PageDivider />
          <RelatedPosts posts={related} />
        </>
      )}
    </article>
  );
};

export default BlogPost;
