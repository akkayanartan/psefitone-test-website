"use client";
import { useState, useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const TARGET = new Date("2026-05-05T00:00:00");

function getCountdown() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function CountdownBanner() {
  const [time, setTime] = useState(getCountdown());
  const reduced = useReducedMotion();

  useEffect(() => {
    setTime(getCountdown());
    if (reduced) return;
    const id = setInterval(() => setTime(getCountdown()), 1000);
    return () => clearInterval(id);
  }, [reduced]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="countdown-banner" role="timer" aria-live="off" aria-label="Programa başlangıca kalan süre">
      <div className="countdown-inner">
        <span className="countdown-label">Programa başlangıca</span>

        <div className="countdown-units">
          <div className="countdown-unit">
            <span className="countdown-num" suppressHydrationWarning>{pad(time.days)}</span>
            <span className="countdown-unit-label">gün</span>
          </div>
          <span className="countdown-sep" aria-hidden="true">:</span>
          <div className="countdown-unit">
            <span className="countdown-num" suppressHydrationWarning>{pad(time.hours)}</span>
            <span className="countdown-unit-label">saat</span>
          </div>
          <span className="countdown-sep" aria-hidden="true">:</span>
          <div className="countdown-unit">
            <span className="countdown-num" suppressHydrationWarning>{pad(time.minutes)}</span>
            <span className="countdown-unit-label">dak</span>
          </div>
          <span className="countdown-sep" aria-hidden="true">:</span>
          <div className="countdown-unit">
            <span className="countdown-num" suppressHydrationWarning>{pad(time.seconds)}</span>
            <span className="countdown-unit-label">sn</span>
          </div>
        </div>

        <a href="#basvur" className="countdown-cta" aria-label="Başvuru formuna git">
          Başvur →
        </a>
      </div>
    </div>
  );
}
