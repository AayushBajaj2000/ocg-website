type Props = {
  pill: string;
};

const CardPill: React.FC<Props> = ({ pill }) => {
  return (
    <span className="bg-brand-blue/5 text-brand-blue px-2 py-1 text-xs font-medium tracking-[-2%] sm:text-base">
      {pill}
    </span>
  );
};

export default CardPill;
