import { PlusIcon } from "@/components/icons";
import Banner from "@/components/layout/sections/Banner";
import { AnimatedIconButton } from "@/components/ui/buttons/AnimatedIconButton";
import { HOME_SECTION } from "@/lib/constants";

const Hero: React.FC = () => {
  return (
    <Banner title={HOME_SECTION.hero.title} description={HOME_SECTION.hero.description}>
      <AnimatedIconButton
        label={HOME_SECTION.hero.cta.label}
        icon={<PlusIcon className="size-5" />}
        href={HOME_SECTION.hero.cta.href}
      />
    </Banner>
  );
};

export default Hero;
