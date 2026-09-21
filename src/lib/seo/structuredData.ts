import { FOOTER } from "@/lib/constants/layout";
import { getSiteUrl } from "@/lib/env/server";
import { PAGE_SEO, SITE_NAME } from "@/lib/seo/pages";
import type { IFaq } from "@/types";

const organizationId = (site: string) => `${site}/#organization`;

/**
 * The company, as a ProfessionalService (a LocalBusiness subtype). There is no street address on
 * purpose: the site only ever says "Toronto, ON, Canada", and markup must not claim more than the
 * page does.
 */
export const organizationJsonLd = () => {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": organizationId(site),
    name: SITE_NAME,
    url: site,
    logo: `${site}/icon-512.png`,
    image: `${site}/og/home`,
    description: PAGE_SEO.home.description,
    email: "info@opencoregroup.com",
    telephone: "+1-647-493-2673",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    areaServed: "CA",
    sameAs: (FOOTER.socialLinks ?? []).map((link) => link.href),
  };
};

export const websiteJsonLd = () => {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    name: SITE_NAME,
    url: site,
    publisher: { "@id": organizationId(site) },
    inLanguage: "en-CA",
  };
};

export const faqJsonLd = (faqs: IFaq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});
