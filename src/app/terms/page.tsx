import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal/contact";
import { TERMS_INTRO, TERMS_SECTIONS } from "@/lib/legal/terms";
import { pageMetadata } from "@/lib/seo/pages";

export const metadata = pageMetadata("terms");

const Page = () => (
  <LegalPage
    title="Terms of Use"
    effectiveDate={LEGAL_EFFECTIVE_DATE}
    intro={TERMS_INTRO}
    sections={TERMS_SECTIONS}
  />
);

export default Page;
