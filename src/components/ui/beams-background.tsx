"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

export interface BeamsBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  /** Remplit le parent au lieu du viewport (sections de page). */
  contained?: boolean;
  /** Fond blanc uni en mode clair (sans faisceaux animés). */
  plainLight?: boolean;
}

const OPACITY_MAP = {
  subtle: 0.55,
  medium: 0.75,
  strong: 1,
} as const;

const MINIMUM_BEAMS = 20;

function fmaHue(): number {
  const roll = Math.random();
  if (roll < 0.4) return 330 + Math.random() * 25;
  if (roll < 0.75) return 200 + Math.random() * 20;
  return 265 + Math.random() * 20;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.1 + Math.random() * 0.14,
    hue: fmaHue(),
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

function isDarkTheme() {
  return document.documentElement.classList.contains("dark");
}

export function BeamsBackground({
  className,
  children,
  intensity = "subtle",
  contained = false,
  plainLight = false,
}: BeamsBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = contained ? root.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const cssWidth = Math.max(rect.width, 1);
      const cssHeight = Math.max(rect.height, 1);

      sizeRef.current = { width: cssWidth, height: cssHeight };
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const totalBeams = Math.round(MINIMUM_BEAMS * (contained ? 1 : 1.5));
      beamsRef.current = Array.from({ length: totalBeams }, () => createBeam(cssWidth, cssHeight));
    };

    updateCanvasSize();

    const resizeObserver = contained ? new ResizeObserver(updateCanvasSize) : null;
    if (resizeObserver) resizeObserver.observe(root);
    else window.addEventListener("resize", updateCanvasSize);

    const themeObserver = new MutationObserver(updateCanvasSize);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    function resetBeam(beam: Beam, index: number, totalBeams: number, width: number, height: number) {
      const column = index % 3;
      const spacing = width / 3;

      beam.y = height + 100;
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = fmaHue();
      beam.opacity = (isDarkTheme() ? 0.18 : 0.1) + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(context: CanvasRenderingContext2D, beam: Beam, themeMultiplier: number) {
      context.save();
      context.translate(beam.x, beam.y);
      context.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity =
        beam.opacity * themeMultiplier * (0.8 + Math.sin(beam.pulse) * 0.2) * OPACITY_MAP[intensity];

      const gradient = context.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `hsla(${beam.hue}, 72%, 58%, 0)`);
      gradient.addColorStop(0.1, `hsla(${beam.hue}, 72%, 58%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 72%, 58%, ${pulsingOpacity})`);
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 72%, 58%, ${pulsingOpacity})`);
      gradient.addColorStop(0.9, `hsla(${beam.hue}, 72%, 58%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${beam.hue}, 72%, 58%, 0)`);

      context.fillStyle = gradient;
      context.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      context.restore();
    }

    function animate() {
      const { width, height } = sizeRef.current;
      if (!width || !height) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const context = ctx as CanvasRenderingContext2D;
      context.clearRect(0, 0, width, height);
      context.filter = "blur(35px)";

      const themeMultiplier = isDarkTheme() ? 1 : 0.65;
      const totalBeams = beamsRef.current.length;

      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams, width, height);
        }

        drawBeam(context, beam, themeMultiplier);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", updateCanvasSize);
      themeObserver.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity, contained]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative w-full overflow-hidden",
        plainLight ? "bg-white dark:bg-[var(--bg)]" : "bg-[var(--bg)]",
        contained ? "min-h-0" : "min-h-screen",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className={cn("pointer-events-none absolute inset-0", plainLight && "hidden dark:block")}
        style={{ filter: "blur(15px)" }}
      />

      <motion.div
        className={cn(
          "pointer-events-none absolute inset-0",
          plainLight ? "hidden dark:block dark:bg-[var(--bg)]/10" : "bg-[var(--bg)]/5 dark:bg-[var(--bg)]/10"
        )}
        animate={{ opacity: [0.04, 0.12, 0.04] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        style={{ backdropFilter: "blur(50px)" }}
        aria-hidden
      />

      {children ? <section className="relative z-10">{children}</section> : null}
    </div>
  );
}
