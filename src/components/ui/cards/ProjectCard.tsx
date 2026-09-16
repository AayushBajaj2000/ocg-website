import Image from "next/image";
import Link from "next/link";
import CardPill from "@/components/ui/cards/CardPill";
import { cn } from "@/lib/utils";
import { IProject } from "@/types";
import { ArrowIcon } from "@/components/icons";
import { Reveal } from "@/components/ui/animations/Reveal";

type Props = IProject & { rtl?: boolean; priority?: boolean };

const STEP = 0.06;

const ProjectCard: React.FC<Props> = ({
  cardImg,
  title,
  caption,
  tags,
  startDate = "01-01-2025",
  endDate = "01-01-2026",
  present = true,
  testimonial,
  slug = "/work/project-1",
  rtl,
  priority = true,
}) => {
  return (
    <Link
      href={slug}
      prefetch={false}
      className="group grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-0"
    >
      <Reveal
        as="div"
        amount={0.2}
        className={cn("w-full", {
          "lg:order-first": !rtl,
          "lg:order-last": rtl,
        })}
      >
        {cardImg?.url && (
          <Image
            src={cardImg.url}
            alt={cardImg.alt ?? ""}
            width={1920}
            height={1080}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn(
              "size-full object-cover transition-all duration-300 ease-in-out group-hover:scale-103",
              {
                "group-hover:rotate-3": !rtl,
                "group-hover:-rotate-3": rtl,
              },
            )}
            style={{ width: "100%", height: "100%" }}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        )}
      </Reveal>
      <div
        className={cn("flex flex-col justify-between gap-10", {
          "lg:pr-14": rtl,
          "lg:pl-14": !rtl,
        })}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col flex-wrap justify-between gap-2 md:flex-row md:items-center">
            {tags && (
              <Reveal as="div" className="flex gap-2">
                {tags.map((t, i) => (
                  <CardPill pill={t} key={t + i} />
                ))}
              </Reveal>
            )}
            <Reveal
              as="span"
              delay={STEP}
              className="text-black-3 order-first text-xs tracking-[-2%] sm:text-base md:order-last"
            >
              {new Date(startDate).getFullYear()} -{" "}
              {present ? "PRESENT" : endDate ? new Date(endDate).getFullYear() : ""}
            </Reveal>
          </div>
          <Reveal
            as="h2"
            delay={STEP * 2}
            className="text-black-1 text-base font-medium tracking-[-2%] sm:text-xl"
          >
            {title}
          </Reveal>
          <Reveal
            as="p"
            delay={STEP * 3}
            className="text-black-3 line-clamp-3 text-sm font-medium tracking-[-2%] sm:text-base"
          >
            {caption}
          </Reveal>
          <Reveal
            as="span"
            delay={STEP * 4}
            className="text-black-1 group-hover:text-brand-blue mt-4 flex items-center gap-2 text-base font-medium transition-colors duration-300 ease-in-out"
          >
            Read case study
            <ArrowIcon className="h-4 w-4.5 transition-transform duration-300 ease-in-out group-hover:translate-x-4" />
          </Reveal>
        </div>

        <div className="bg-sunken flex flex-col gap-8 p-4">
          <Reveal as="span" className="text-black-3 text-base font-medium">
            &quot;{testimonial?.feedback}&quot;
          </Reveal>
          <Reveal as="div" delay={STEP} className="flex items-center gap-2">
            {testimonial?.client?.img?.url && (
              <Image
                src={testimonial.client.img.url}
                alt={testimonial.client.img.alt ?? ""}
                className="size-11.5 overflow-hidden rounded-full"
                width={46}
                height={46}
                style={{ width: "auto", height: "auto" }}
              />
            )}
            <div className="flex flex-col">
              <span className="text-black-1 text-base font-normal">
                {testimonial?.client?.name}
              </span>
              <span className="text-black-3 text-sm font-normal">{testimonial?.client?.role}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
