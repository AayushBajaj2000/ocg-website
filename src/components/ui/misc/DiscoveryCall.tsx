"use client";

import Image from "next/image";
import Link from "next/link";
import { m, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import type { IDiscoveryCall } from "@/types";
import { AnimatedIconButton } from "@/components/ui/buttons/AnimatedIconButton";
import { PlusIcon } from "@/components/icons";

type Props = IDiscoveryCall & {
  variants?: Variants;
  onNavigate?: () => void;
  className?: string;
};

const DiscoveryCall: React.FC<Props> = ({
  heading,
  subheading,
  host,
  cta,
  variants,
  onNavigate,
  className,
}) => {
  return (
    <div className={cn(className)}>
      <m.div variants={variants} className="mb-6 lg:mb-8 xl:px-10">
        <h2 className="text-black-1 text-base font-medium tracking-[-2%] md:text-2xl">{heading}</h2>
        <p className="text-black-3 text-sm tracking-[-2%] md:text-lg">{subheading}</p>
      </m.div>

      <m.div
        variants={variants}
        className="border-hairline flex flex-col justify-between gap-4 border p-4 md:flex-row lg:flex-col xl:flex-row xl:gap-0"
      >
        <div className="flex items-center gap-2 md:gap-6">
          <Image
            src={host.avatar}
            alt=""
            aria-hidden="true"
            width={45}
            height={45}
            className="size-11.25 object-cover"
          />
          <div>
            <p className="text-black-1 text-base font-medium">{host.name}</p>
            <p className="text-black-3 text-sm">{host.role}</p>
          </div>
        </div>

        <div className="hidden md:block">
          <AnimatedIconButton
            label={cta.label}
            href={cta.href}
            icon={<PlusIcon className="size-5" />}
            containerClassName="xl:flex-auto lg:flex-1 md:flex-auto flex-1"
          />
        </div>

        <Link
          href={cta.href}
          onClick={onNavigate}
          className="bg-brand-blue flex h-10 items-center justify-center font-medium text-neutral-50 md:hidden"
        >
          {cta.label}
        </Link>
      </m.div>
    </div>
  );
};

export default DiscoveryCall;
