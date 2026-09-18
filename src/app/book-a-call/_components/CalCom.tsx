import { Suspense } from "react";
import Section from "@/components/layout/sections/Section";
import CalEmbedLoader from "@/app/book-a-call/_components/CalEmbedLoader";
import CalEmbedSkeleton from "@/app/book-a-call/_components/CalEmbedSkeleton";

const CalCom: React.FC = () => {
  return (
    <Section as="section" container containerClassName="border-x md:pb-20 pb-10">
      <Suspense fallback={<CalEmbedSkeleton />}>
        <CalEmbedLoader />
      </Suspense>
    </Section>
  );
};

export default CalCom;
