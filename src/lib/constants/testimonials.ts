import { ITestimonialCard, ITestimonials } from "@/types";

const PAGE_FLOORING: ITestimonialCard = {
  feedback:
    "OpenCore elevated our brand with a modern website, showcasing craftsmanship and significantly improving client engagement and overall market visibility.",
  rating: 5,
  client: {
    name: "Blaise Page",
    role: "CEO of page flooring",
    logo: { url: "/clients/icons/pageflooring.svg", alt: "page flooring" },
  },
  metrics: [
    { value: "100 / 10", label: "Satisfaction score" },
    { value: "100 / 10", label: "Satisfaction score" },
  ],
};

export const TESTIMONIALS_SECTION: ITestimonials = {
  title: "We let our clients speak for us!",
  description:
    "We don't measure success by launches. We measure it by the business that continue to grow after them.",
  testimonials: Array.from({ length: 5 }, () => PAGE_FLOORING),
};
