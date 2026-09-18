"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { buildBookingConfig } from "@/lib/constants/booking";
import CalEmbedSkeleton from "@/app/book-a-call/_components/CalEmbedSkeleton";

const CalEmbed = dynamic(() => import("@/app/book-a-call/_components/CalEmbed"), {
  ssr: false,
  loading: () => <CalEmbedSkeleton />,
});

const CalEmbedLoader: React.FC = () => {
  const searchParams = useSearchParams();

  return <CalEmbed config={buildBookingConfig(searchParams)} />;
};

export default CalEmbedLoader;
