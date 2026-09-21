import { PlusIcon } from "@/components/icons";
import { AnimatedIconButton } from "@/components/ui/buttons/AnimatedIconButton";
import { HOME_SECTION } from "@/lib/constants";

const BlogPostCta: React.FC = () => {
  return (
    <aside
      aria-label="Work with OpenCore"
      className="border-hairline bg-sunken mt-10 flex flex-col gap-6 border p-6 md:mt-16 md:flex-row md:items-center md:justify-between md:p-8"
    >
      <p className="text-black-1 max-w-60 text-xl font-medium tracking-[-2%] md:text-2xl">
        See how we embed with teams like yours!
      </p>
      <AnimatedIconButton
        label={HOME_SECTION.hero.cta.label}
        icon={<PlusIcon className="size-5" />}
        href={HOME_SECTION.hero.cta.href}
      />
    </aside>
  );
};

export default BlogPostCta;
