import FeatureRows, { type Feature } from "@/app/work/anesthesia-one/_components/FeatureRows";
import AOHeading from "@/app/work/anesthesia-one/_components/Heading";
import Section from "@/components/layout/sections/Section";

const SOLUTION_FEATURES: Feature[] = [
  {
    title: "Native mobile apps.",
    description:
      "Purpose-built for anesthesiology workflows and delivered to both major app stores, with the submission and review process handled end to end.",
    image: { src: "/anesthesia-one/app/solution-1.webp", alt: "AnesthesiaOne app on two iPhones" },
  },
  {
    title: "Clinical calculators and guided flows.",
    description:
      "The reference and calculation tools clinicians reach for, including the resuscitation algorithms, designed for speed and accuracy under pressure.",
    image: {
      src: "/anesthesia-one/app/solution-2.webp",
      alt: "Calculator and drug dosing screens from the app",
    },
  },
  {
    title: "Offline-capable by design",
    description:
      "The app synchronizes its data to the device, so the tools keep working when the connection doesn't. In a hospital that matters.",
    image: {
      src: "/anesthesia-one/app/solution-3.webp",
      alt: "Illustration of three clinicians using the app",
    },
  },
  {
    title: "Rebuilt web platform.",
    description:
      "The existing web application was moved onto modern infrastructure and redesigned to match the app. One product, two surfaces, one data source.",
    image: {
      src: "/anesthesia-one/app/solution-4.webp",
      alt: "Redesigned web platform home with calculators, drugs and handbook",
    },
  },
  {
    title: "Brand and identity.",
    description:
      "A visual system built for clinical credibility, applied consistently across app, web and store presence.",
    image: {
      src: "/anesthesia-one/app/solution-5.webp",
      alt: "AnesthesiaOne typography and colour palette",
    },
  },
  {
    title: "Technical framing.",
    description:
      "The platform runs on a managed relational backend with a device-side sync layer. The app holds its own working copy of the data and reconciles when it reconnects, rather than failing the moment signal drops. Modernizing the framework underneath the web app at the same time meant both surfaces shared one source of truth.",
    image: {
      src: "/anesthesia-one/app/solution-6.webp",
      alt: "Mobile and web apps syncing to one relational backend",
    },
  },
];

const Solution: React.FC = () => {
  return (
    <Section
      as="section"
      container
      containerClassName="md:py-16 py-10 border-x flex flex-col md:gap-10 gap-4"
    >
      <AOHeading
        caption="Solution"
        title="One clinical platform, on every device, online or not."
      />
      <FeatureRows variant="app" features={SOLUTION_FEATURES} />
    </Section>
  );
};

export default Solution;
