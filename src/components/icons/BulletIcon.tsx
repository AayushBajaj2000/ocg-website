type IconProps = {
  className?: string;
};

export function BulletIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 6 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="2.8" fill="currentColor" />
    </svg>
  );
}
