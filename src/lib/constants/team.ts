import { ITeam, ITeamCard } from "@/types";

// The roster (names, roles, photos) comes from Sanity; doodles are local artwork, keyed by the
// member's CMS name. Members without an entry simply render without doodles.
export const TEAM_DOODLES: Record<string, Pick<ITeamCard, "topDoodle" | "bottomDoodle">> = {
  "Aayush Bajaj": {
    topDoodle: { url: "/team/aayush/top-left-icon.svg", width: 121, height: 120 },
    bottomDoodle: { url: "/team/aayush/bottom-right-icon.svg", width: 136, height: 139 },
  },
  "Austin Page": {
    topDoodle: { url: "/team/austin/top-left-icon.svg", width: 136, height: 126 },
    bottomDoodle: { url: "/team/austin/bottom-right-icon.svg", width: 122, height: 100 },
  },
  "Sameer Siddiqui": {
    topDoodle: { url: "/team/sameer/top-left-icon.svg", width: 168, height: 158 },
    bottomDoodle: { url: "/team/sameer/bottom-right-icon.svg", width: 151, height: 147 },
  },
  "Ally Majelan": {
    topDoodle: { url: "/team/ally/top-left-icon.svg", width: 129, height: 119 },
    bottomDoodle: { url: "/team/ally/bottom-right-icon.svg", width: 85, height: 78 },
  },
  "Waleed Ali Khan": {
    topDoodle: { url: "/team/waleed/top-left-icon.svg", width: 147, height: 142 },
    bottomDoodle: { url: "/team/waleed/bottom-right-icon.svg", width: 127, height: 122 },
  },
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
};
