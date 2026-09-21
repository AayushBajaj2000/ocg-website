import DesktopHero from "@/app/_components/desktop-hero/DesktopHero";
import { DesktopModeProvider } from "@/app/_components/desktop-hero/DesktopMode";

const Hero: React.FC = () => {
  return (
    <DesktopModeProvider>
      <DesktopHero />
    </DesktopModeProvider>
  );
};

export default Hero;
