import { CalIcon, WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/buttons/Button";
import { Reveal } from "@/components/ui/animations/Reveal";
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
        <div className="flex flex-col gap-1">
          <Reveal as="p" className="text-base text-black" byLine delay={delay + step}>
            Didn&apos;t find the answer?
          </Reveal>
          <Reveal as="span" className="text-black-3 text-base" byLine delay={delay * 1.5}>
            Book a call and let&apos;s have a chat.
          </Reveal>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <Reveal delay={delay + step * 2}>
          <Button href="/" variant="book-call">
            <CalIcon className="size-5" />
            Book a call
          </Button>
        </Reveal>
        <Reveal delay={delay + step * 3}>
          <Button href="/" variant="book-call">
            <WhatsAppIcon className="size-5" />
            Chat on WhatsApp
          </Button>
        </Reveal>
        <Reveal as="span" className="text-black-3 mt-4 text-base" byLine delay={delay * 4}>
          or email us:{" "}
          <a href="mailto:info@opencouregroup.com" className="underline underline-offset-2">
            info@opencoregroup.com
          </a>
        </Reveal>
      </div>
    </div>
  );
};

export default AskMe;
