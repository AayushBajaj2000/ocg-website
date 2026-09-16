import { IImage } from "@/types";

/** Inline-drawn artwork. `url` must be a plain path: the markup is fetched and animated. */
export interface ITeamDoodle {
  url: string;
  width: number;
  height: number;
}

export interface ITeamCard {
  img: IImage;
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
