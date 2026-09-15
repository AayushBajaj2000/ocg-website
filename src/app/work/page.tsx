import { Metadata } from "next";
import Work from "@/app/work/_components/Work";
import { WORK_SECTION } from "@/lib/constants/work";

export const metadata: Metadata = {
  title: "Work | OpenCore Group",
  description: WORK_SECTION.description,
};

const WorkPage = () => <Work />;

export default WorkPage;
