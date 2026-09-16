import type { ReactNode } from "react";
import { BulletIcon } from "@/components/icons/BulletIcon";

type Props = {
  isActive: boolean;
  children: ReactNode;
};

const NavLinkLabel: React.FC<Props> = ({ isActive, children }) => (
  <span className="flex min-w-0 overflow-hidden">
    <span
      className={`${isActive ? "translate-x-0" : "-translate-x-1.5"} flex min-w-0 items-center gap-2 transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none`}
    >
      <BulletIcon className="size-1.5 shrink-0" />
      {children}
    </span>
  </span>
);

export default NavLinkLabel;
