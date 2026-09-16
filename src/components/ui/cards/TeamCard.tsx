import Image from "next/image";
import SequentialDrawSvg from "@/components/ui/animations/SequentialDrawSvg";
import { cn } from "@/lib/utils";
import { ITeamCard } from "@/types";

export type TeamCardTilt = "left" | "right";

type Props = ITeamCard & {
  tilt: TeamCardTilt;
  /** The centred card leans fully; the rest lean less and ease into it as they arrive. */
  isActive: boolean;
  /** Whether the doodles are traced in. */
  drawn: boolean;
  /** Whether the doodle markup should be fetched yet. */
  loadDoodles: boolean;
};

export const TeamCardWrapper: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("border-hairline flex flex-col justify-between gap-8 border", className)}>
      {children}
    </div>
  );
};

const TILT_ROTATION: Record<TeamCardTilt, { active: string; idle: string }> = {
  right: { active: "rotate-[10deg]", idle: "rotate-[4deg]" },
  left: { active: "rotate-[-10deg]", idle: "rotate-[-4deg]" },
};

// Doodles sit on the corners the card leans away from, so they never overlap it.
const DOODLE_POSITIONS: Record<TeamCardTilt, { top: string; bottom: string }> = {
  right: {
    top: "-top-12 -left-14 md:-top-22 md:-left-26",
    bottom: "-right-14 -bottom-12 md:-right-26 md:-bottom-22",
  },
  left: {
    top: "-top-12 -right-14 md:-top-22 md:-right-26",
    bottom: "-bottom-12 -left-14 md:-bottom-22 md:-left-26",
  },
};

const TeamCard: React.FC<Props> = ({
  img,
  name,
  role,
  topDoodle,
  bottomDoodle,
  tilt,
  isActive,
  drawn,
  loadDoodles,
}) => {
  const doodleClass = "z-10 w-16 md:w-30";

  return (
    <div className="relative">
      {topDoodle && (
        <SequentialDrawSvg
          doodle={topDoodle}
          load={loadDoodles}
          drawn={drawn}
          className={cn(doodleClass, DOODLE_POSITIONS[tilt].top)}
        />
      )}
      <figure
        className={cn(
          "shadow-team-card flex w-50 flex-col gap-3.5 bg-white px-2 py-3.75 transition-[rotate] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none md:w-71 md:gap-7 md:px-3.75 md:py-7.5",
          TILT_ROTATION[tilt][isActive ? "active" : "idle"],
        )}
      >
        <div className="relative h-35 w-full bg-black/25 md:h-49.25">
          <Image
            src={img.url}
            alt={img.alt}
            fill
            sizes="(min-width: 768px) 254px, 124px"
            className="object-cover"
          />
        </div>
        <figcaption className="flex flex-col text-center">
          <span className="font-switzer text-base tracking-[-2%] text-black md:text-xl">
            {name}
          </span>
          <span className="font-switzer text-xs tracking-[-2%] text-black/70 md:text-sm">
            {role}
          </span>
        </figcaption>
      </figure>
      {bottomDoodle && (
        <SequentialDrawSvg
          doodle={bottomDoodle}
          load={loadDoodles}
          drawn={drawn}
          className={cn(doodleClass, DOODLE_POSITIONS[tilt].bottom)}
        />
      )}
    </div>
  );
};

export default TeamCard;
