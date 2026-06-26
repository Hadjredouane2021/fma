"use client";

import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { FMA_HEX } from "@/lib/fma-brand-colors";

/** Dégradés par défaut — charte FMA (bordeaux, bleu, mauve, taupe) */
export const FMA_GRADIENTS = [
  `linear-gradient(135deg, ${FMA_HEX.burgundy} 0%, ${FMA_HEX.blue} 100%)`,
  `linear-gradient(135deg, ${FMA_HEX.blue} 0%, ${FMA_HEX.mauve} 100%)`,
  `linear-gradient(135deg, ${FMA_HEX.mauve} 0%, ${FMA_HEX.taupe} 100%)`,
  `linear-gradient(135deg, ${FMA_HEX.burgundy} 0%, ${FMA_HEX.mauve} 100%)`,
  `linear-gradient(135deg, ${FMA_HEX.burgundy} 0%, ${FMA_HEX.blue} 100%)`,
] as const;

type GradientBackgroundProps = React.ComponentProps<"div"> & {
  gradients?: string[];
  animationDuration?: number;
  animationDelay?: number;
  enableCenterContent?: boolean;
  overlay?: boolean;
  overlayOpacity?: number;
};

export function GradientBackground({
  children,
  className,
  gradients = [...FMA_GRADIENTS],
  animationDuration = 8,
  animationDelay = 0.5,
  enableCenterContent = true,
  overlay = false,
  overlayOpacity = 0.3,
  ...props
}: GradientBackgroundProps) {
  return (
    <div
      className={cn("relative min-h-screen w-full overflow-hidden", className)}
      {...props}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: gradients[0] }}
        animate={{ background: gradients }}
        transition={{
          delay: animationDelay,
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        aria-hidden
      />

      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />
      )}

      {children && (
        <div
          className={cn(
            "relative z-10 w-full",
            enableCenterContent && "flex min-h-screen items-center justify-center"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
