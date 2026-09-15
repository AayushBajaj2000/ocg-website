"use client";

import { m, useReducedMotion } from "motion/react";
import { ChevronIcon } from "@/components/icons";
import NavLinkLabel from "@/components/ui/NavLinkLabel";
import { CHEVRON_OPEN_ROTATION, SETTLE_SPRING } from "@/components/layout/headerDropdownMotion";

type Props = {
  label: string;
  isActive: boolean;
  isOpen: boolean;
};

const NavDropdownTriggerContent: React.FC<Props> = ({ label, isActive, isOpen }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <NavLinkLabel isActive={isActive}>{label}</NavLinkLabel>
      <m.span
        aria-hidden="true"
        initial={false}
        animate={{ rotate: isOpen ? CHEVRON_OPEN_ROTATION : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : SETTLE_SPRING}
        className="inline-flex shrink-0"
      >
        <ChevronIcon />
      </m.span>
    </>
  );
};

export default NavDropdownTriggerContent;
