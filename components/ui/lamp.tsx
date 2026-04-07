"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * LampContainer — fullscreen section wrapper.
 *
 * The lamp filament sits at y=0 (the section boundary / divider).
 * Beams fan downward as a pure absolute background layer.
 * Content starts below the glow zone, centred in the illuminated space.
 */
export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const bg = "#0e0a1a";

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center overflow-hidden",
        className
      )}
      style={{ background: bg }}
    >
      {/* ── Lamp — absolute background, filament at y=0 ──────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0"
        style={{ height: "56vh", minHeight: "320px" }}
      >
        {/* scaleY wrapper for the depth illusion */}
        <div
          className="relative flex h-full w-full items-start justify-center"
          style={{ transform: "scaleY(1.15)", transformOrigin: "top" }}
        >
          {/* left conic beam */}
          <motion.div
            initial={{ opacity: 0.1, width: "8rem" }}
            whileInView={{ opacity: 0.45, width: "32rem" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 1.1, ease: "easeInOut" }}
            className="absolute top-0 right-1/2 h-56 overflow-visible"
            style={{
              backgroundImage:
                "conic-gradient(from 70deg at center top, rgba(134,41,255,0.9), transparent, transparent)",
            }}
          >
            <div
              className="absolute bottom-0 left-0 z-10 h-40 w-full"
              style={{
                background: bg,
                WebkitMaskImage: "linear-gradient(to top, white, transparent)",
                maskImage: "linear-gradient(to top, white, transparent)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 z-10 h-full w-40"
              style={{
                background: bg,
                WebkitMaskImage: "linear-gradient(to right, white, transparent)",
                maskImage: "linear-gradient(to right, white, transparent)",
              }}
            />
          </motion.div>

          {/* right conic beam */}
          <motion.div
            initial={{ opacity: 0.1, width: "8rem" }}
            whileInView={{ opacity: 0.45, width: "32rem" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 1.1, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 h-56 overflow-visible"
            style={{
              backgroundImage:
                "conic-gradient(from 290deg at center top, transparent, transparent, rgba(134,41,255,0.9))",
            }}
          >
            <div
              className="absolute bottom-0 right-0 z-10 h-full w-40"
              style={{
                background: bg,
                WebkitMaskImage: "linear-gradient(to left, white, transparent)",
                maskImage: "linear-gradient(to left, white, transparent)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 z-10 h-40 w-full"
              style={{
                background: bg,
                WebkitMaskImage: "linear-gradient(to top, white, transparent)",
                maskImage: "linear-gradient(to top, white, transparent)",
              }}
            />
          </motion.div>

          {/* blur fill — blends beam bottoms into page bg */}
          <div
            className="absolute top-1/2 h-48 w-full translate-y-10 scale-x-150 blur-2xl"
            style={{ background: bg }}
          />

          {/* wide diffuse halo */}
          <div
            className="absolute left-1/2 z-10 h-40 w-[34rem] -translate-x-1/2 rounded-full blur-3xl"
            style={{ top: "46%", background: "rgba(134,41,255,0.15)" }}
          />

          {/* tight core glow just below the filament */}
          <motion.div
            initial={{ width: "4rem" }}
            whileInView={{ width: "15rem" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 1.1, ease: "easeInOut" }}
            className="absolute left-1/2 z-20 h-20 -translate-x-1/2 rounded-full blur-2xl"
            style={{ top: "2px", background: "rgba(134,41,255,0.26)" }}
          />

          {/* filament line at section boundary */}
          <motion.div
            initial={{ width: "6rem", opacity: 0 }}
            whileInView={{ width: "32rem", opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.15, duration: 1, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 z-30 h-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(203,195,214,0.5) 20%, rgba(227,224,170,0.8) 50%, rgba(203,195,214,0.5) 80%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* ── Content — sits below the glow zone ───────────────────────────── */}
      <div
        className="relative z-10 flex w-full flex-1 flex-col items-center pb-20"
        style={{ paddingTop: "clamp(4rem, 12vh, 7rem)" }}
      >
        {children}
      </div>
    </div>
  );
};
