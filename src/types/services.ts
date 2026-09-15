import type { LinkProps } from "next/link";
import type { PortableTextBlock } from "@/types/portableText";

export interface IVideoSource {
  src: string;
  type: "video/mp4" | "video/webm";
}

export interface IVideo {
  sources: IVideoSource[];
  width: number;
  height: number;
  poster?: string;
}

export interface IServiceCta {
  label: string;
  href: LinkProps["href"];
}

export interface IService {
  _key: string;
  title: string;
  video: IVideo;
  content: PortableTextBlock[];
  cta: IServiceCta;
}

export interface IServices {
  title: string;
  description: string;
  services: IService[];
}
