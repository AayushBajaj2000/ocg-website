import { ITeam, ITeamCard } from "@/types";

// Placeholder roster: the same member five times until real profiles land.
const AUSTIN: ITeamCard = {
  img: { url: "/team/austin/austin.webp", alt: "Austin Page" },
  name: "Austin Page",
  role: "Co-Founder, OpenCore Group",
  topDoodle: { url: "/team/austin/top-left-icon.svg", width: 136, height: 126 },
  bottomDoodle: { url: "/team/austin/bottom-right-icon.svg", width: 122, height: 100 },
};

export const TEAM_SECTION: ITeam = {
  title: "Meet the team",
  description:
    "Our team members are the heartbeat of our company. Get to know a team and culture that prioritizes work ethic, collaboration, and kindness!",
  badge: {
    url: "/graphics/ontario-badge.webp",
    alt: "ontario badge",
  },
  lineOne:
    "OpenCore was intentionally built differently. No unnecessary layers. No handing projects from one department to another.",
  lineTwo:
    "You work directly with the people designing, building, and shaping your product from day one.",
  team: Array.from({ length: 5 }, () => AUSTIN),
};
