type Props = {
  className?: string;
};

const DividerLines: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="1437"
      height="9"
      viewBox="0 0 1437 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="1435.6"
        y1="0.5"
        x2="0.5"
        y2="0.5"
        stroke="#E3E3E3"
        strokeLinecap="round"
        strokeDasharray="0.5 5"
      />
      <line
        x1="1435.6"
        y1="2.9585"
        x2="0.5"
        y2="2.9585"
        stroke="#E3E3E3"
        strokeLinecap="round"
        strokeDasharray="0.5 5"
      />
      <line
        x1="1435.6"
        y1="5.44751"
        x2="0.5"
        y2="5.44751"
        stroke="#E3E3E3"
        strokeLinecap="round"
        strokeDasharray="0.5 5"
      />
      <line
        x1="1435.6"
        y1="7.67432"
        x2="0.5"
        y2="7.67432"
        stroke="#E3E3E3"
        strokeLinecap="round"
        strokeDasharray="0.5 5"
      />
    </svg>
  );
};

export default DividerLines;
