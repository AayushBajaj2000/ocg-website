type IconProps = {
  className?: string;
};

/** 3x3 dot grid used as the mobile nav menu trigger. */
export function GridMenuIcon({ className }: IconProps) {
  const positions = [4, 12, 20];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {positions.flatMap((y) =>
        positions.map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" />
        )),
      )}
    </svg>
  );
}
