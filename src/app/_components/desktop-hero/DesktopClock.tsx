"use client";

import { useEffect, useState } from "react";

const format = (date: Date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false });

// Renders the design's 9:41 on the server, then the visitor's own time once mounted.
const DesktopClock: React.FC = () => {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const tick = () => setTime(format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <time
      className="text-xs leading-4 font-semibold text-white tabular-nums"
      suppressHydrationWarning
    >
      {time}
    </time>
  );
};

export default DesktopClock;
