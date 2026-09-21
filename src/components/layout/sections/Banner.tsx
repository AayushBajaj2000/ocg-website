import Section from "@/components/layout/sections/Section";
import BannerShader from "@/components/shaders/banner-shader/BannerShader";
import BannerHeading from "@/components/ui/headings/BannerHeading";

type Props = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

const Banner: React.FC<Props> = ({ title, description, children }) => {
  return (
    <Section
      container
      containerClassName="isolate bg-center bg-cover bg-no-repeat flex h-90.5 items-end pb-16 md:h-94 md:pb-12 border-x"
    >
      <BannerShader />
      <BannerHeading title={title} description={description}>
        {children}
      </BannerHeading>
    </Section>
  );
};

export default Banner;
