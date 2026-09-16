import Section from "@/components/layout/sections/Section";
import DividerLines from "@/components/ui/dividers/DividerLines";

const PageDivider: React.FC = () => {
  return (
    <Section
      className="border-y-hairline border-y"
      container
      containerClassName="border-x border-x-hairline xl:px-0! px-0! md:px-0!"
    >
      <DividerLines />
    </Section>
  );
};

export default PageDivider;
