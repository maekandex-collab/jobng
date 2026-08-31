/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  format?: "normal" | "compact";
  className?: string;
}

const formatValue = (value: number, format: CountUpProps["format"]) => {
  if (format === "compact") {
    return Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return value.toLocaleString();
};

export default function CountUp({
  target,
  duration = 1200,
  suffix = "",
  format = "normal",
  className,
}: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let animationFrameId: number | null = null;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.round(progress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, duration]);

  return (
    <span className={className}>
      {formatValue(count, format)}
      {suffix}
    </span>
  );
}
