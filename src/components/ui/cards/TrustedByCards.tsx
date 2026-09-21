import TrustedByCard from "@/components/ui/cards/TrustedByCard";
import type { TrustedByItem } from "@/types";

const TrustedByCards: React.FC<{ items: TrustedByItem[] }> = ({ items }) => {
  return (
    <ul className="border-hairline grid w-full grid-cols-2 border-t *:shadow-[1px_0_0_0_var(--color-hairline),0_1px_0_0_var(--color-hairline),1px_1px_0_0_var(--color-hairline)] md:grid-cols-3 lg:grid-cols-6">
      {items.map((item) =>
        item._type === "cta" ? (
          <TrustedByCard key={item._key} cta={item} />
        ) : (
          <TrustedByCard key={item._key} client={item} />
        ),
      )}
    </ul>
  );
};

export default TrustedByCards;
