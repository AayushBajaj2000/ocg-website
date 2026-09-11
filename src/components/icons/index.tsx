type Props = {
  className?: string;
};

export const MenuIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="4.70588" height="4.70588" rx="2.35294" />
      <rect x="5.64697" width="4.70588" height="4.70588" rx="2.35294" />
      <rect x="11.2944" width="4.70588" height="4.70588" rx="2.35294" />
      <rect y="5.64713" width="4.70588" height="4.70588" rx="2.35294" />
      <rect x="5.64697" y="5.64697" width="4.70588" height="4.70588" rx="2.35294" />
      <rect x="11.2944" y="5.64713" width="4.70588" height="4.70588" rx="2.35294" />
      <rect y="11.2943" width="4.70588" height="4.70588" rx="2.35294" />
      <rect x="5.64697" y="11.2943" width="4.70588" height="4.70588" rx="2.35294" />
      <rect x="11.2944" y="11.2943" width="4.70588" height="4.70588" rx="2.35294" />
    </svg>
  );
};

export const PlusIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M13.459 6.86471H18.1344V11.4064H13.459V6.86471Z" />
      <path d="M13.459 0H18.1344V4.54173H13.459V0Z" />
      <path d="M13.5269 13.7294H18.2023V18.2711H13.5269V13.7294Z" />
      <path d="M13.5948 20.5936H18.2702V25.1353H13.5948V20.5936Z" />
      <path d="M20.5103 13.729H25.1856V18.2707H20.5103V13.729Z" />
      <path d="M0 13.7291H4.67534V18.2709H0V13.7291Z" />
      <path d="M27.3247 13.7291H32V18.2709H27.3247V13.7291Z" />
      <path d="M6.8144 13.7291H11.4897V18.2709H6.8144V13.7291Z" />
      <path d="M13.6628 27.4583H18.3381V32H13.6628V27.4583Z" />
    </svg>
  );
};

export const ArrowIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="19"
      height="16"
      viewBox="0 0 19 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M7.74343 6.79384H10.4198V9.39374H7.74343V6.79384Z" />
      <path d="M11.741 6.79361H14.4174V9.39351H11.741V6.79361Z" />
      <path d="M0 6.79368H2.67638V9.39358H0V6.79368Z" />
      <path d="M15.6419 6.79368H18.3183V9.39358H15.6419V6.79368Z" />
      <path d="M3.90087 6.79368H6.57725V9.39358H3.90087V6.79368Z" />
      <path d="M12.3165 10.1776H14.9929V12.7775H12.3165V10.1776Z" />
      <path d="M9.03384 13.4001H11.7102V16H9.03384V13.4001Z" />
      <path d="M12.1634 0H9.48704V2.59989H12.1634V0Z" />
      <path d="M15.4461 3.22248H12.7697V5.82237H15.4461V3.22248Z" />
    </svg>
  );
};
