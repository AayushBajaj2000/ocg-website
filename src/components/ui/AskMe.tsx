import { Button } from "@/components/ui/Button";
import Image from "next/image";

const AskMe: React.FC = () => {
  return (
    <div className="bg-sunken flex flex-col gap-8 p-4 md:gap-12 md:p-6">
      <div className="flex flex-col gap-4 md:gap-6">
        <Image src="/logo-filled.svg" alt="logo filled" width={64} height={64} />
        <p className="font-switzer text-base text-black md:text-2xl">
          Didn't find the answer? I'm human being, just like you - ask me anything 👇🏻
        </p>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Button href="/" variant="book-call">
          Book a call
        </Button>
      </div>
    </div>
  );
};

export default AskMe;
