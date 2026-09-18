import { StarIcon } from "@/components/icons";
import Image from "next/image";
import type { ITestimonialCard, ITestimonialMetric } from "@/types";

const TestimonialMetric: React.FC<ITestimonialMetric> = ({ value, label }) => {
  return (
    <div className="bg-sunken flex h-40.5 flex-col items-start justify-between p-3.5 md:h-47">
      <p className="md:text-footer-desktop text-footer-mobile font-switzer tracking-[-2%] text-black">
        {value}
      </p>
      <span className="font-switzer text-black-2 text-xs tracking-[-2%] uppercase">{label}</span>
    </div>
  );
};

const TestimonialCard: React.FC<ITestimonialCard> = ({ feedback, rating, client, metrics }) => {
  return (
    <div className="flex h-full flex-col items-center gap-6 bg-white px-3.5 pt-6 pb-6 text-center md:pt-10 md:pb-5">
      <div
        role="img"
        aria-label={`Rated ${rating} out of 5`}
        className="text-brand-blue flex items-center gap-1.5"
      >
        {Array.from({ length: rating }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <blockquote className="text-black-1 font-switzer mx-auto max-w-102.75 text-base font-medium tracking-[-2%] md:text-xl">
        &ldquo;{feedback}&rdquo;
      </blockquote>
      <div className="flex items-center justify-center gap-1.5">
        <Image
          src={client.logo.url}
          alt={client.logo.alt}
          width={38}
          height={38}
          className="object-cover"
        />
        <div className="flex flex-col text-left">
          <p className="text-black-1 font-switzer text-sm tracking-[-2%]">{client.name}</p>
          <span className="text-black-3 font-switzer text-xs tracking-[-2%]">{client.role}</span>
        </div>
      </div>
      <div className="mt-auto grid w-full grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <TestimonialMetric key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;
