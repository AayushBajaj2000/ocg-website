"use client";

import { useState } from "react";
import WorkCards from "@/app/work/fraiche-table/_components/WorkCards";
import WorkSheet, { WORK_SHEET_TABS } from "@/app/work/fraiche-table/_components/WorkSheet";

const WorkExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <>
      <WorkCards onOpen={(index) => setActiveTab(WORK_SHEET_TABS[index])} />
      <WorkSheet
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setActiveTab(null)}
      />
    </>
  );
};

export default WorkExplorer;
