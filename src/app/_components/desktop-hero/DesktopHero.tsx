import Image from "next/image";
import DesktopBrowser from "@/app/_components/desktop-hero/DesktopBrowser";
import DesktopFinder from "@/app/_components/desktop-hero/DesktopFinder";
import DesktopFolder from "@/app/_components/desktop-hero/DesktopFolder";
import DesktopClock from "@/app/_components/desktop-hero/DesktopClock";
import DesktopIcon from "@/app/_components/desktop-hero/DesktopIcon";
import DesktopShell from "@/app/_components/desktop-hero/DesktopShell";
import DesktopWallpaperVideo from "@/app/_components/desktop-hero/DesktopWallpaperVideo";
import DesktopPeople from "@/app/_components/desktop-hero/DesktopPeople";
import { PlusIcon } from "@/components/icons";
import Section from "@/components/layout/sections/Section";
import BannerHeading from "@/components/ui/headings/BannerHeading";
import { AnimatedIconButton } from "@/components/ui/buttons/AnimatedIconButton";
import { HOME_SECTION } from "@/lib/constants";
import { gloriaHallelujah } from "@/lib/fonts";

const { desktop, hero } = HOME_SECTION;

const DesktopHero: React.FC = () => {
  return (
    <Section
      container
      aria-label="OpenCore OS desktop"
      className={gloriaHallelujah.variable}
      containerClassName="border-x px-0!"
    >
      {/* Sized off the viewport so the headline below lands in the first screen too. */}
      <DesktopShell className="h-[clamp(22rem,calc(100svh-25.5rem),25rem)] md:h-[clamp(24rem,calc(100svh-21rem),35rem)]">
        <div className="desktop-hero-stage">
          <Image
            src={desktop.wallpaper}
            alt="Five OpenCore teammates working at desks in a grassy field, under clouds that gather to spell OpenCore as whales drift past"
            fill
            priority
            // The stage overflows the hero to cover it, so it is wider than the viewport on phones.
            sizes="(min-width: 1536px) 1437px, (min-width: 768px) max(100vw, 1127px), 853px"
            className="object-cover select-none"
            draggable={false}
          />
          <DesktopWallpaperVideo {...desktop.video} />
          <DesktopPeople people={desktop.people} />
        </div>

        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-[#d9d9d9]/5 px-4 py-2 backdrop-blur-[2px]">
          <Image src="/hero-os/logo-mark.svg" alt="OpenCore" width={12} height={12} />
          <div className="flex items-center gap-4">
            <Image src="/hero-os/headphones.svg" alt="" width={16} height={16} />
            <Image
              src="/hero-os/battery.svg"
              alt=""
              width={24}
              height={10}
              style={{ width: 24, height: "auto" }}
            />
            <DesktopClock />
          </div>
        </div>

        {/* Docked on a phone: two rows across the top. Otherwise (see `.desktop-icons`): a
            column that wraps into a new one when the desktop is too short to hold it. */}
        <nav aria-label="Desktop shortcuts" className="absolute top-14 bottom-4 left-2 md:left-6">
          <ul className="desktop-icons grid grid-flow-col grid-rows-[auto_auto] content-start gap-x-2 gap-y-5 md:gap-x-8">
            {desktop.icons.map((icon) => (
              <li key={icon.label}>
                <DesktopIcon {...icon} />
              </li>
            ))}
            <li>
              <DesktopFolder {...desktop.folder} />
            </li>
          </ul>
        </nav>

        <div className="absolute top-14 right-2 hidden group-data-[full=true]/desktop:block md:right-6">
          <DesktopIcon {...desktop.contact} />
        </div>
        <DesktopFinder
          title={desktop.folder.label}
          files={desktop.folder.files}
          shortcuts={desktop.folder.shortcuts}
        />
        <DesktopBrowser />
      </DesktopShell>

      <div className="px-4 py-8 md:px-8">
        <BannerHeading
          title={hero.title}
          description={hero.description}
          titleClassName="lg:max-w-167!"
        >
          <AnimatedIconButton
            label={hero.cta.label}
            icon={<PlusIcon className="size-5" />}
            href={hero.cta.href}
          />
        </BannerHeading>
      </div>
    </Section>
  );
};

export default DesktopHero;
