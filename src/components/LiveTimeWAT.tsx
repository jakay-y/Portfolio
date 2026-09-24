import { useEffect, useState } from "react";

function formatLagosTime() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  }).format(new Date());
}

/** Live Africa/Lagos (WAT) clock, refreshed every 30s. */
export function LiveTimeWAT() {
  const [time, setTime] = useState(formatLagosTime);

  useEffect(() => {
    const interval = setInterval(() => setTime(formatLagosTime()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return <span className="font-mono tabular-nums">{time} WAT</span>;
}
