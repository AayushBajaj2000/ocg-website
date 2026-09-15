import { Metadata } from "next";
import Company from "@/app/company/_components/Company";
import { COMPANY_SECTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services | OpenCore Group",
  description: COMPANY_SECTION.description,
};

const CompanyPage = () => <Company />;

export default CompanyPage;
