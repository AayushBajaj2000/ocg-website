import type { IImage } from "@/types/components";

export interface IFounderBookImage extends IImage {
  width: number;
  height: number;
  sizes: string;
}

export type FounderBookScrapKind = "eggsPhoto" | "ai" | "bugs" | "fry";

export type FounderBookEggKind = "eggAi" | "eggBugs" | "eggFry";

export interface IFounderBookScrap {
  kind: FounderBookScrapKind;
  label: string;
  img: IFounderBookImage;
}

export interface IFounderBookEgg {
  kind: FounderBookEggKind;
  label: string;
  tag: string;
  lines: string[];
}

export interface IFounderBookCollage {
  label: string;
  note: string;
  annotation: string;
  photo: IFounderBookScrap;
  eggs: IFounderBookEgg[];
  scraps: IFounderBookScrap[];
  stamp: IFounderBookImage;
}

export interface IFounderBook {
  label: string;
  edition: string;
  established: string;
  title: [string, string];
  scrollHint: string;
  logo: IFounderBookImage;
  skyline: IFounderBookImage;
  spreadLabel: string;
  heading: string;
  paragraphs: string[];
  author: {
    name: string;
    role: string;
    portrait: IFounderBookImage;
  };
  collage: IFounderBookCollage;
}
