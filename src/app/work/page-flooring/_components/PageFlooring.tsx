import PhaseNav from "@/app/work/page-flooring/_components/PhaseNav";
import Platform from "@/app/work/page-flooring/_components/platform";
import Rebrand from "@/app/work/page-flooring/_components/rebrand";

const PageFlooring: React.FC = () => {
  return (
    <PhaseNav
      label="Case study phase"
      phases={[
        { id: "platform", label: "The Platform", content: <Platform /> },
        { id: "rebrand", label: "The Rebrand", content: <Rebrand /> },
      ]}
    />
  );
};

export default PageFlooring;
