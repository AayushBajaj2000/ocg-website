import { fetchBlogPosts } from "@/lib/blog/server";
import { fetchFaqs } from "@/lib/faq/server";
import {
  BLOG_PATH,
  BOOKING,
  HOME_SECTION,
  SERVICES_SECTION,
  WORD_SECTION,
  WORK_SECTION,
  blogPostHref,
} from "@/lib/constants";
import { getSiteUrl } from "@/lib/env/server";
import type { PortableTextBlock } from "@/types";

// ISR: regenerated at most hourly, with the Sanity content it lists. Must be a literal for Next's
// static analysis — keep in sync with SANITY_REVALIDATE_SECONDS.
export const revalidate = 3600;

const blockText = (block: PortableTextBlock) => block.children.map((span) => span.text).join("");

/**
 * /llms.txt — a plain-Markdown summary of the site for AI assistants and crawlers, which is what
 * the footer's "Hey AI, learn more about us!" link points at. Everything here is copy that already
 * appears on the site, so it can't drift into claims the pages don't make.
 */
export const GET = async () => {
  const site = getSiteUrl();
  const [posts, faqs] = await Promise.all([fetchBlogPosts(), fetchFaqs()]);

  const services = SERVICES_SECTION.services.map((service) => {
    const [intro, ...rest] = service.content;
    const offerings = rest.filter((block) => block.listItem).map(blockText);
    return `### ${service.title}\n${blockText(intro)}\n${offerings.map((o) => `- ${o}`).join("\n")}`;
  });

  const body = [
    `# OpenCore Group`,
    `> ${HOME_SECTION.hero.description}`,
    `OpenCore Group is based in Toronto, Ontario, Canada. ${WORD_SECTION.description}`,
    `## Services\n${SERVICES_SECTION.description}\n\n${services.join("\n\n")}`,
    `## Work\n${WORK_SECTION.description}\n\n${WORK_SECTION.projects
      .map((project) => `- [${project.title}](${site}${String(project.slug)}): ${project.caption}`)
      .join("\n")}`,
    `## Blog\n${posts.map((post) => `- [${post.title}](${site}${blogPostHref(post.slug)})`).join("\n")}`,
    `## Frequently asked questions\n${faqs.map((faq) => `### ${faq.question}\n${faq.answer}`).join("\n\n")}`,
    `## Pages\n${[
      ["Home", "/"],
      ["Work", "/work"],
      ["Services", "/services"],
      ["Company", "/company"],
      ["Blog", BLOG_PATH],
      ["Resources", "/resources"],
      ["Contact", "/contact"],
      ["Book a call", BOOKING.path],
    ]
      .map(([label, path]) => `- [${label}](${site}${path})`)
      .join("\n")}`,
    `## Contact\n- Email: info@opencoregroup.com\n- Start a project: ${site}/contact\n- Book an intro call: ${site}${BOOKING.path}`,
  ].join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
