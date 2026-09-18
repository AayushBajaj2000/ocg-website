import type { ReactNode } from "react";
import Section from "@/components/layout/sections/Section";

type Props = {
  filter: ReactNode;
  children: ReactNode;
  status?: ReactNode;
  busy?: boolean;
};

/** Shared shell for the blog grid and its skeleton, so both occupy identical space. */
const BlogsGridLayout: React.FC<Props> = ({ filter, children, status, busy }) => (
  <Section
    as="section"
    aria-label="Insights"
    aria-busy={busy || undefined}
    container
    containerClassName="flex flex-col md:gap-12 gap-8 md:pb-16 pb-10 border-x"
  >
    {filter}
    {status}
    <ul role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {children}
    </ul>
  </Section>
);

export default BlogsGridLayout;
