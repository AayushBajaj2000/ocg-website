"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ResourceDialog from "@/app/resources/_components/ResourceDialog";
import { resourcesQueryOptions } from "@/lib/resources/queries";
import { closeResourcePopup } from "@/lib/resources/utils";
import { RESOURCE_QUERY_PARAM } from "@/lib/constants/resources";

// Reads `?resource=` and opens that resource's popup. Rendered in its own Suspense boundary: reading
// search params opts only this component out of static rendering, not the grid.
const ResourceDialogController: React.FC = () => {
  const slug = useSearchParams().get(RESOURCE_QUERY_PARAM);
  const { data: resources } = useQuery(resourcesQueryOptions);
  const resource = slug ? resources?.find((item) => item.slug === slug) : undefined;

  return <ResourceDialog resource={resource} onClose={closeResourcePopup} />;
};

export default ResourceDialogController;
