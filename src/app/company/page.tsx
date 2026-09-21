import Company from "@/app/company/_components/Company";
import { pageMetadata } from "@/lib/seo/pages";

export const metadata = pageMetadata("company");

const CompanyPage = () => <Company />;

export default CompanyPage;
