type Props = {
  pill: string;
};

const CardPill: React.FC<Props> = ({ pill }) => {
  return (
    <span className="bg-brand-blue/5 text-brand-blue font-switzer px-2 py-1 text-xs tracking-[-2%] sm:text-base">
      {pill}
    </span>
  );
};

export default CardPill;
