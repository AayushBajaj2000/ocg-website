import { IImage } from "@/types";

export interface ITeamCard {
  img?: IImage;
  name?: string;
  role?: string;
  topLeftIcon?: IImage;
  bottomRightIcon?: IImage;
}

export interface ITeam {
  badge?: IImage;
  lineOne?: string;
  lineTwo?: string;
  team?: ITeamCard[];
}
