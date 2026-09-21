import Image from "next/image";
import {
  DesktopLink,
  DesktopModeButton,
  DesktopModeLabel,
} from "@/app/_components/desktop-hero/DesktopMode";
import type { IHomeDesktopIcon } from "@/types";

const WRAPPER =
  "group flex w-[min(6.25rem,calc((100cqw-2rem)/3))] flex-col items-center gap-2 rounded-md py-1 outline-none focus-visible:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/60";

const DesktopIcon: React.FC<IHomeDesktopIcon> = ({ label, fullLabel, href, img }) => {
  const content = (
    <>
      <span className="flex h-15 items-center justify-center">
        <Image
          src={img.url}
          alt={img.alt}
          width={img.width}
          height={img.height}
          style={{ width: img.width, height: img.height }}
          className="object-cover transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
        />
      </span>
      <span className="rounded-xs px-1 text-center text-[11.2px] font-medium tracking-[0.01em] whitespace-nowrap text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.45)] group-hover:bg-white/20">
        {fullLabel ? <DesktopModeLabel docked={label} full={fullLabel} /> : label}
      </span>
    </>
  );

  return href ? (
    <DesktopLink href={href} title={label} className={WRAPPER}>
      {content}
    </DesktopLink>
  ) : (
    <DesktopModeButton className={`${WRAPPER} cursor-pointer`}>{content}</DesktopModeButton>
  );
};

export default DesktopIcon;
