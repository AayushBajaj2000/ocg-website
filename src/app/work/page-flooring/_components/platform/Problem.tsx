"use client";

import { PFHeading } from "@/app/work/page-flooring/_components/platform/Outcome";
import { StarIcon } from "@/components/icons";
import Section from "@/components/layout/sections/Section";
import { Reveal } from "@/components/ui/animations/Reveal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const PROBLEM_TEXTS: string[] = [
  "Page Flooring ran on enterprise software, the real kind with the real price tag. When they asked for the small, specific things their business needed, the answer was no. Nothing was impossible; it just wasn't on the roadmap",
  "So they did what every capable operator does: they built around it. A board tool here because the main system couldn't track projects the way they work. A spreadsheet there. A manual process to bridge the gap between the system that holds the money and the system that holds the job. Each one was a smart fix. Together they became the problem.",
  "Data lived in four places, which means it lived in none of them. Reconciling anything meant human. They were paying for multiple platforms, paying people to keep those platforms in sync, and still looking at building new things to fill the gaps left over. The workaround stack cost more than the software it was patching.",
  "In this industry the gaps were in the most expensive place. The name of the game in the trades is paying and getting paid: purchase orders, bills of lading, schedule of values, progress billing, lead times on material ordered months before it's installed. It is transactional work that behaves like a service business, and generic project software doesn't understand any of it.",
];

const Problem: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<string>("before");
  return (
    <Section
      as="section"
      container
      containerClassName="flex flex-col gap-4 border-x py-10 md:gap-8 md:py-16"
    >
      <div className="max-w-196.5">
        <PFHeading
          caption="Problem"
          title="They were paying a premium for software that couldn't say yes."
        />
      </div>
      <div className="flex flex-col items-start gap-4 md:gap-16 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 md:gap-5.5">
          {PROBLEM_TEXTS.map((p, i) => (
            <Reveal
              key={`${p}-${i}`}
              as="p"
              className="font-switzer tet-black-3 text-sm tracking-[-2%] md:text-base"
              byLine
            >
              {p}
            </Reveal>
          ))}
        </div>
        <div className="border-black-3 mx-auto flex w-full max-w-110 flex-col gap-3.5 border border-dashed p-6 lg:mx-0">
          <div className="text-brand-blue flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <p className="text-black-1 font-switzer text-lg tracking-[-2%]">
            Very knowledgeable team! I must say from the start of our dealings right up until the
            end - I was thoroughly impressed with their communication, efficiency and ability to
            listen to our needs and translate that into a finished product! Highly recommend using
            OpenCore!
          </p>
          <div className="flex items-center gap-3">
            <div className="bg-black-2 size-9.5 rounded-full" />
            <div className="flex flex-col">
              <span className="font-switzer text-black-1 text-sm font-medium tracking-[-2%]">
                Dylan Page
              </span>
              <span className="font-switzer text-black-3 text-sm tracking-[-2%]">
                Page Flooring
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <PFHeading caption="The stack, before and after" />
          <div className="flex h-8 border border-black">
            <button
              type="button"
              className={cn(
                "font-switzer h-full cursor-pointer px-4 text-sm font-medium tracking-[-2%] outline-none focus:outline-none",
                {
                  "bg-black text-white": selectedImg === "before",
                  "text-black-3 bg-transparent": selectedImg !== "before",
                },
              )}
              onClick={() => setSelectedImg("before")}
            >
              Before
            </button>
            <button
              type="button"
              className={cn(
                "font-switzer h-full cursor-pointer px-4 text-sm font-medium tracking-[-2%] outline-none focus:outline-none",
                {
                  "bg-black text-white": selectedImg === "after",
                  "text-black-3 bg-transparent": selectedImg !== "after",
                },
              )}
              onClick={() => setSelectedImg("after")}
            >
              After
            </button>
          </div>
        </div>
        {selectedImg === "before" && (
          <Image
            src="/page-flooring/platform/before.webp"
            alt="before"
            width={1428}
            height={486}
            className="h-100 object-cover"
          />
        )}
        {selectedImg === "after" && (
          <Image
            src="/page-flooring/platform/after.webp"
            alt="after"
            width={1428}
            height={486}
            className="h-100 object-cover"
          />
        )}
      </div>
    </Section>
  );
};

export default Problem;
