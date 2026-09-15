import type { Metadata } from "next";
import Services from "@/app/services/_components/Services";
import { SERVICES_SECTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services | OpenCore Group",
  description: SERVICES_SECTION.description,
};

const ServicesPage = () => <Services />;

export default ServicesPage;
