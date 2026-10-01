import { useEffect, useState } from "react";

// Counts down to `until` (epoch ms) once per second; returns remaining whole seconds.
const useCountdown = (until) => {
  const [remaining, setRemaining] = useState(() =>
    until ? Math.max(0, Math.ceil((until - Date.now()) / 1000)) : 0
  );

  useEffect(() => {
    if (!until) {
      setRemaining(0);
      return undefined;
    }
    const tick = () => setRemaining(Math.max(0, Math.ceil((until - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [until]);

  return remaining;
};

export default useCountdown;
