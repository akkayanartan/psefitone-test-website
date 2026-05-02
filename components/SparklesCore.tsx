"use client";
import React, { useId } from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const { id, className, background, minSize, maxSize, speed, particleColor, particleDensity } = props;
  const [init, setInit] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, [reduced]);

  const particlesLoaded = async (container?: Container) => {
    if (container) setLoaded(true);
  };
  const generatedId = useId();

  if (reduced) return null;

  return (
    <div
      className={cn(
        "transition-opacity duration-1000 ease-out",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background || "transparent" } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 60,
            pauseOnBlur: true,
            pauseOnOutsideViewport: true,
            particles: {
              color: { value: particleColor || "#cbc3d6" },
              move: { enable: true, speed: { min: 0.1, max: 0.6 }, direction: "none", outModes: { default: "out" } },
              number: { density: { enable: true, width: 400, height: 400 }, value: particleDensity || 100 },
              opacity: { value: { min: 0.05, max: 0.7 }, animation: { enable: true, speed: speed || 1, sync: false } },
              size: { value: { min: minSize || 0.5, max: maxSize || 2 } },
              shape: { type: "circle" },
            },
            detectRetina: true,
          }}
        />
      )}
    </div>
  );
};
