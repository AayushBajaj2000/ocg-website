import Image from "next/image";
import {
  DesktopLink,
  DesktopModeButton,
  DesktopModeLabel,
} from "@/app/_components/desktop-hero/DesktopMode";
import { ICON_LABEL, ICON_WRAPPER } from "@/app/_components/desktop-hero/desktopStyles";
import type { IHomeDesktopIcon } from "@/types";

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
      <span className={ICON_LABEL}>
        {fullLabel ? <DesktopModeLabel docked={label} full={fullLabel} /> : label}
      </span>
    </>
  );

  return href ? (
    <DesktopLink href={href} title={label} className={ICON_WRAPPER}>
      {content}
    </DesktopLink>
  ) : (
    <DesktopModeButton className={`${ICON_WRAPPER} cursor-pointer`}>{content}</DesktopModeButton>
  );
};

export default DesktopIcon;
