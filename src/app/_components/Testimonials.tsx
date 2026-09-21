import Section from "@/components/layout/sections/Section";
import TestimonialCarousel from "@/components/ui/carousels/TestimonialCarousel";
import SectionHeading from "@/components/ui/headings/SectionHeading";
import { TESTIMONIALS_SECTION } from "@/lib/constants";
import { fetchTestimonials } from "@/lib/testimonials/server";

const Testimonials = async () => {
  const testimonials = await fetchTestimonials();
  if (!testimonials.length) return null;

  return (
    <Section
      as="section"
      className="bg-sunken"
      container
      containerClassName="border-x md:py-16 py-10 md:gap-16 gap-8 flex flex-col md:gap-16 gap-8"
    >
      <div className="mx-auto max-w-150">
        <SectionHeading
          title={TESTIMONIALS_SECTION.title}
          description={TESTIMONIALS_SECTION.description}
        />
      </div>
      <TestimonialCarousel testimonials={testimonials} />
    </Section>
  );
};

export default Testimonials;
