import Section from "@/components/layout/sections/Section";
import { FounderBookShader } from "@/components/shaders/founder-book-shader";
import { FOUNDER_BOOK } from "@/lib/constants";
import { caveat } from "@/lib/fonts";

const FounderSection: React.FC = () => {
  return (
    <Section
      aria-label={FOUNDER_BOOK.label}
      className={caveat.variable}
      container
      containerClassName="border-x overflow-clip! px-4! min-[701px]:px-10! pb-10"
    >
      <FounderBookShader content={FOUNDER_BOOK} />
    </Section>
  );
};

export default FounderSection;
