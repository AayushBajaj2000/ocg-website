import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "@/app/blog/[slug]/_components/BlogPost";
import { fetchBlogPost, fetchBlogPosts, fetchBlogPostSlugs } from "@/lib/blog/server";
import { blogPostHref } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env/server";

// ISR: statically generated, refreshed at most hourly. Must be a literal for Next's static
// analysis — keep in sync with SANITY_REVALIDATE_SECONDS.
export const revalidate = 3600;

const RELATED_POST_COUNT = 3;

// Open Graph cards are 1200 × 630; Sanity crops the hero to that shape.
const toShareImage = (url: string) => `${url}?w=1200&h=630&fit=crop&auto=format`;

export const generateStaticParams = async () =>
  (await fetchBlogPostSlugs()).map((slug) => ({ slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return {};

  const title = `${post.title} | OpenCore Group`;
  const images = post.image && [{ url: toShareImage(post.image.url), width: 1200, height: 630 }];

  return {
    title,
    description: post.excerpt,
    alternates: { canonical: blogPostHref(post.slug) },
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      url: blogPostHref(post.slug),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author && [post.author.name],
      images,
    },
    twitter: { card: "summary_large_image", title, description: post.excerpt, images },
  };
};

const BlogPostPage = async ({ params }: PageProps<"/blog/[slug]">) => {
  const { slug } = await params;
  const [post, posts] = await Promise.all([fetchBlogPost(slug), fetchBlogPosts()]);
  if (!post) notFound();

  const related = posts.filter((other) => other.slug !== post.slug).slice(0, RELATED_POST_COUNT);
  const url = `${getSiteUrl()}${blogPostHref(post.slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: url,
    image: post.image && toShareImage(post.image.url),
    author: post.author && { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: "OpenCore Group", url: getSiteUrl() },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // `<` is escaped so a title can never close the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BlogPost post={post} related={related} />
    </>
  );
};

export default BlogPostPage;
