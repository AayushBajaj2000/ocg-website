import "server-only";
import { sanityFetch } from "@/lib/sanity/client";
import { FAQS_QUERY } from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/constants/sanity";
import type { IFaq } from "@/types";

/** Queries Sanity directly. Cached by Next's data cache for the content ISR window. */
export const fetchFaqs = async (): Promise<IFaq[]> => {
  const faqs = await sanityFetch<IFaq[]>(FAQS_QUERY, SANITY_CACHE_TAGS.faq);
  return faqs.map(({ question, answer }) => ({ question: question.trim(), answer: answer.trim() }));
};
