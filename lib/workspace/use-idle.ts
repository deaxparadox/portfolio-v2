"use client";

import { useEffect, useRef, useState } from "react";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "scroll", "touchstart"] as const;

export function useIdle() {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function resetTimer() {
      setIsIdle(false);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT_MS);
    }

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimer),
    );

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return isIdle;
}
