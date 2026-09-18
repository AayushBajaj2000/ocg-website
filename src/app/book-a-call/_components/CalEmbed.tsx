"use client";
import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { BOOKING } from "@/lib/constants/booking";

type Props = {
  config: Record<string, string>;
};

const CalEmbed: React.FC<Props> = ({ config }) => {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: BOOKING.namespace });

      cal("ui", {
        theme: BOOKING.theme,
        cssVarsPerTheme: {
          light: { "cal-brand": BOOKING.brandColor },
          dark: { "cal-brand": BOOKING.brandColor },
        },
        hideEventTypeDetails: false,
        layout: BOOKING.layout,
      });
    })();
  }, []);

  return (
    <Cal
      namespace={BOOKING.namespace}
      calLink={BOOKING.calLink}
      config={{ ...config, layout: BOOKING.layout, theme: BOOKING.theme }}
      className="min-h-133.75 w-full overflow-auto"
    />
  );
};

export default CalEmbed;
