import "server-only";
import { sanityFetch } from "@/lib/sanity/client";
import { toSanityImage } from "@/lib/sanity/image";
import { TEAM_MEMBERS_QUERY } from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/constants/sanity";
import { TEAM_DOODLES } from "@/lib/constants/team";
import type { ITeamCard, SanityTeamMember } from "@/types";

// A card is a photo with a caption, so a member without a photo is left out.
const normalizeTeamMember = ({ name, role, image, focus }: SanityTeamMember): ITeamCard[] => {
  const img = toSanityImage(image);
  if (!img) return [];

  const memberName = name.trim();
  return [
    {
      img: { ...img, alt: img.alt || memberName },
      imgFocus: focus ? { x: focus.x ?? 0.5, y: focus.y ?? 0.5 } : undefined,
      name: memberName,
      role: role?.trim() ?? "",
      ...TEAM_DOODLES[memberName],
    },
  ];
};

/** Queries Sanity directly. Cached by Next's data cache for the content ISR window. */
export const fetchTeamMembers = async (): Promise<ITeamCard[]> => {
  const members = await sanityFetch<SanityTeamMember[]>(TEAM_MEMBERS_QUERY, SANITY_CACHE_TAGS.team);
  return members.flatMap(normalizeTeamMember);
};
