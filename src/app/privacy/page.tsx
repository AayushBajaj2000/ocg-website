import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal/contact";
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/lib/legal/privacy";
import { pageMetadata } from "@/lib/seo/pages";

export const metadata = pageMetadata("privacy");

const Page = () => (
  <LegalPage
    title="Privacy Policy"
    effectiveDate={LEGAL_EFFECTIVE_DATE}
    intro={PRIVACY_INTRO}
    sections={PRIVACY_SECTIONS}
  />
);

export default Page;
