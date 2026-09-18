"use client";

import { useState } from "react";
import AccordionLg from "@/components/ui/accordions/AccordionLg";
import { Reveal } from "@/components/ui/animations/Reveal";
import type { IService } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  services: IService[];
  isDark?: boolean;
};

const STEP = 0.08;

const ServiceAccordions: React.FC<Props> = ({ services, isDark }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div
      className={cn("border-t", {
        "border-t-hairline": !isDark,
        "border-t-hairline-dark": isDark,
      })}
    >
      {services.map((service, index) => (
        <Reveal key={service._key} delay={index * STEP}>
          <AccordionLg
            index={index}
            service={service}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
            isDark={isDark}
          />
        </Reveal>
      ))}
    </div>
  );
};

export default ServiceAccordions;
