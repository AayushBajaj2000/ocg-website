"use client";

import Link from "next/link";
import Image from "next/image";
import { PlusIcon } from "@/components/icons";
import NavLinks from "@/components/ui/NavLinks";
import { AnimatedIconButton } from "@/components/ui/AnimatedIconButton";
import { useHideOnScroll } from "@/components/layout/hooks/useHideOnScroll";
import HeaderMob from "@/components/layout/HeaderMob";
import DividerLines from "@/components/ui/DividerLines";

const Header: React.FC = () => {
  const hidden = useHideOnScroll();

  return (
    <header
      className={`border-b-hairline fixed inset-x-0 top-0 z-999 border-b bg-white ${hidden ? "-translate-y-full" : "translate-y-0"} transition-transform duration-300 ease-in-out motion-reduce:transition-none`}
    >
      <nav
        aria-label="Main"
        className="border-x-hairline app-container flex h-18 w-full items-center justify-between border-x px-4 md:mx-5 md:h-23.5 md:px-5"
      >
        <Link href="/" aria-label="OpenCore Group, home" className="relative z-30">
          <Image
            src="/logo.svg"
            alt=""
            width={191}
            height={32}
            loading="eager"
            className="hidden lg:block"
          />
          <Image
            src="/logo-mob.svg"
            alt=""
            width={26}
            height={26}
            loading="eager"
            className="lg:hidden"
          />
        </Link>

        <NavLinks />

        <div className="hidden lg:block">
          <AnimatedIconButton href="#" label="Book a call" icon={<PlusIcon className="size-4" />} />
        </div>

        <HeaderMob />
      </nav>
      <div className="border-t-hairline border-t">
        <div className="border-x-hairline app-container w-full border-x xl:px-0!">
          <DividerLines />
        </div>
      </div>
    </header>
  );
};

export default Header;
