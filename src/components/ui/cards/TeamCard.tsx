import Image from "next/image";
import { cn } from "@/lib/utils";
import { ITeamCard } from "@/types";

type Props = ITeamCard;

export const TeamCardWrapper: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "border-hairline flex flex-col justify-between gap-8 border p-5 md:p-10 xl:min-h-181.75",
        className,
      )}
    >
      {children}
    </div>
  );
};

const TeamCard: React.FC<Props> = ({ img, name, role }) => {
  return (
    <div className="relative">
      <Image
        src="/team/austin/top-left-icon.svg"
        alt="top left icon austin"
        width={110}
        height={86}
        className="absolute -top-20 -left-20 z-10 object-cover"
      />
      <div className="shadow-team-card flex w-35 rotate-[13.87deg] flex-col gap-3.5 bg-white px-2 py-3.75 md:w-71 md:gap-7 md:px-3.75 md:py-7.5">
        <div className="h-24.25 w-full bg-black/25 md:h-49.25">
          <Image
            src="/team/austin/austin.webp"
            alt="austin"
            width={254}
            height={197}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col text-center">
          <span className="font-switzer text-base tracking-[-2%] text-black md:text-xl">
            Austin Page
          </span>
          <span className="font-switzer text-xs tracking-[-2%] text-black/70 md:text-sm">
            Co-Founder, OpenCore Group
          </span>
        </div>
      </div>
      <Image
        src="/team/austin/bottom-right-icon.svg"
        alt="top left icon austin"
        width={110}
        height={86}
        className="absolute -right-20 -bottom-20 z-10 object-cover"
      />
    </div>
  );
};

export default TeamCard;
