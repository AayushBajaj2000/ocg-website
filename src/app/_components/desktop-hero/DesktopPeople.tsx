import type { IHomeDesktopPerson } from "@/types";

type Props = {
  people: IHomeDesktopPerson[];
};

/** Hotspots over the figures in the wallpaper; each reveals a name tag. */
const DesktopPeople: React.FC<Props> = ({ people }) => {
  return (
    <ul>
      {people.map(({ name, x }, index) => (
        <li
          key={index}
          className="absolute top-[72.5%] h-[8%] w-[4.6%] -translate-x-1/2"
          style={{ left: `${x}%` }}
        >
          <button
            type="button"
            aria-label={name}
            className="peer size-full cursor-pointer rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-white/70"
          />
          <span
            aria-hidden
            className="font-gloria-hallelujah pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 translate-y-1 rounded-lg bg-white px-3 py-1 text-[13px] tracking-[0.01em] whitespace-nowrap text-black opacity-0 transition duration-200 peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus:translate-y-0 peer-focus:opacity-100"
          >
            {name}
            <span className="absolute top-full left-1/2 -mt-px size-0 -translate-x-1/2 border-x-[2.5px] border-t-4 border-x-transparent border-t-white" />
          </span>
        </li>
      ))}
    </ul>
  );
};

export default DesktopPeople;
