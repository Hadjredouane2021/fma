"use client";

import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Dégradés par défaut — charte FMA (bordeaux, bleu, mauve, taupe) */
export const FMA_GRADIENTS = [
  "linear-gradient(135deg, #941F49 0%, #3A7BAB 100%)",
  "linear-gradient(135deg, #3A7BAB 0%, #9A96AE 100%)",
  "linear-gradient(135deg, #9A96AE 0%, #B39988 100%)",
  "linear-gradient(135deg, #941F49 0%, #9A96AE 100%)",
  "linear-gradient(135deg, #941F49 0%, #3A7BAB 100%)",
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
