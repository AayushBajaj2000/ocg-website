"use client";

import { useMemo, type MouseEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import CardGridSection from "@/components/layout/sections/CardGridSection";
import { resourcesQueryOptions } from "@/lib/resources/queries";
import { isPlainLeftClick, openResourcePopup, toResourceCard } from "@/lib/resources/utils";

const ResourcesGrid: React.FC = () => {
  const { data: resources, isError } = useQuery(resourcesQueryOptions);
  const cards = useMemo(() => resources?.map(toResourceCard), [resources]);

  // Cards keep their real `?resource=` href (shareable, new-tab friendly); a plain click opens the
  // popup in place instead of navigating.
  const openPopup = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const resource = resources?.[index];
    if (!resource || !isPlainLeftClick(event)) return;
    event.preventDefault();
    openResourcePopup(resource.slug);
  };

  return (
    <CardGridSection
      label="Resources"
      cards={cards}
      isError={isError}
      onCardClick={openPopup}
      noun={{ one: "resource", other: "resources" }}
      emptyMessage="No resources yet. Check back soon."
      errorMessage="We couldn't load resources right now. Please try again later."
    />
  );
};

export default ResourcesGrid;
