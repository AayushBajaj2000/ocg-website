import Home from "@/app/_components/Home";
import JsonLd from "@/components/seo/JsonLd";
import { fetchFaqs } from "@/lib/faq/server";
import { pageMetadata } from "@/lib/seo/pages";
import { faqJsonLd } from "@/lib/seo/structuredData";

export const metadata = pageMetadata("home");

// The FAQ block renders on every page (it lives in the root layout), but repeated FAQ content
// should only be marked up once, so the structured data sits on the home page alone.
const HomePage = async () => {
  const faqs = await fetchFaqs();

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <Home />
    </>
  );
};

export default HomePage;
