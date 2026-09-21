import type { Ref } from "react";
import { WINDOW_FOCUS_RING } from "@/app/_components/desktop-hero/desktopStyles";

type Props = {
  onClose: () => void;
  closeRef?: Ref<HTMLButtonElement>;
};

/** The red / yellow / green window buttons. Only red does anything. */
const DesktopWindowLights: React.FC<Props> = ({ onClose, closeRef }) => {
  return (
    <div className="group/lights flex h-full items-center gap-2 pr-2">
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close window"
        className={`grid size-3 cursor-pointer place-items-center rounded-full bg-[#ff5f57] text-[8px] leading-none font-bold text-black/0 group-hover/lights:text-black/60 ${WINDOW_FOCUS_RING}`}
      >
        ×
      </button>
      <span aria-hidden className="size-3 rounded-full bg-[#febc2e]" />
      <span aria-hidden className="size-3 rounded-full bg-[#28c840]" />
    </div>
  );
};

export default DesktopWindowLights;
