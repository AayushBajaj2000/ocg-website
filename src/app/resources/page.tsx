import Resources from "@/app/resources/_components/Resources";
import { pageMetadata } from "@/lib/seo/pages";

export const metadata = pageMetadata("resources");

// ISR: statically generated, refreshed at most hourly. Must be a literal for Next's static
// analysis — keep in sync with SANITY_REVALIDATE_SECONDS.
export const revalidate = 3600;

const ResourcesPage = () => <Resources />;

export default ResourcesPage;
