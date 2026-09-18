import { Metadata } from "next";
import Resources from "@/app/resources/_components/Resources";

const DESCRIPTION =
  "Free skills, components, Figma files and starters from OpenCore Group – the same resources we use on real client work.";

export const metadata: Metadata = {
  title: "Resources | OpenCore Group",
  description: DESCRIPTION,
  openGraph: {
    title: "Resources | OpenCore Group",
    description: DESCRIPTION,
    type: "website",
  },
};

// ISR: statically generated, refreshed at most hourly. Must be a literal for Next's static
// analysis — keep in sync with SANITY_REVALIDATE_SECONDS.
export const revalidate = 3600;

const ResourcesPage = () => <Resources />;

export default ResourcesPage;
