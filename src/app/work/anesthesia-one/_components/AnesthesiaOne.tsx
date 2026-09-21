import AppWebapp from "@/app/work/anesthesia-one/_components/app";
import Assistant from "@/app/work/anesthesia-one/_components/assistant";
import PhaseNav from "@/app/work/page-flooring/_components/PhaseNav";

const AnesthesiaOne: React.FC = () => {
  return (
    <PhaseNav
      label="Case study product"
      className="bg-white"
      variant="outlined"
      phases={[
        { id: "app", label: "App & Webapp", content: <AppWebapp /> },
        { id: "assistant", label: "AI Assistant", content: <Assistant /> },
      ]}
    />
  );
};

export default AnesthesiaOne;
