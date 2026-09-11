import { CalIcon, WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";

type Props = {
  delay?: number;
  step?: number;
};

const AskMe: React.FC<Props> = ({ delay = 0, step = 0.06 }) => {
  return (
    <div className="bg-sunken flex flex-col gap-8 p-4 md:gap-12 md:p-6">
      <div className="flex flex-col gap-4 md:gap-6">
        <Reveal delay={delay}>
          <Image src="/logo-filled.svg" alt="logo filled" width={64} height={64} />
        </Reveal>
        <Reveal
          as="p"
          className="font-switzer text-base text-black md:text-2xl"
          byLine
          delay={delay + step}
        >
          Didn't find the answer? I'm human being, just like you - ask me anything 👇🏻
        </Reveal>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Reveal delay={delay + step * 2}>
          <Button href="/" variant="book-call">
            <CalIcon className="size-6" />
            Book a call
          </Button>
        </Reveal>
        <Reveal delay={delay + step * 3}>
          <Button href="/" variant="book-call">
            <WhatsAppIcon className="size-6" />
            Chat on WhatsApp
          </Button>
        </Reveal>
      </div>
    </div>
  );
};

export default AskMe;
