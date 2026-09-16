"use client";

import { useState } from "react";
import AccordionLg from "@/components/ui/accordions/AccordionLg";
import { Reveal } from "@/components/ui/animations/Reveal";
import type { IService } from "@/types";

type Props = {
  services: IService[];
};

const STEP = 0.08;

const ServiceAccordions: React.FC<Props> = ({ services }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t-hairline border-t">
      {services.map((service, index) => (
        <Reveal key={service._key} delay={index * STEP}>
          <AccordionLg
            index={index}
            service={service}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
          />
        </Reveal>
      ))}
    </div>
  );
};

export default ServiceAccordions;
