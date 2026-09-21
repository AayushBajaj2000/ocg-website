import { IImage } from "@/types";
import type { ISanityImage, SanityImageAsset } from "@/types/sanity";

/** Inline-drawn artwork. `url` must be a plain path: the markup is fetched and animated. */
export interface ITeamDoodle {
  url: string;
  width: number;
  height: number;
}

export interface ITeamCard {
  img: IImage | ISanityImage;
  /** CMS hotspot centre (0–1 on each axis); the photo is cropped around it. Defaults to centre. */
  imgFocus?: { x: number; y: number };
  name: string;
  role: string;
  topDoodle?: ITeamDoodle;
  bottomDoodle?: ITeamDoodle;
}

export interface ITeam {
  title?: string;
  description?: string;
  badge?: IImage;
  lineOne?: string;
  lineTwo?: string;
  team?: ITeamCard[];
}

/** Raw shape returned by `TEAM_MEMBERS_QUERY`, before normalization. */
export interface SanityTeamMember {
  id: string;
  name: string;
  role: string | null;
  image: SanityImageAsset | null;
  focus: { x: number | null; y: number | null } | null;
}
