import { cn } from "@/lib/utils";

export type GlowVariant = "burgundy" | "mauve" | "blue" | "taupe";

export type GlowConfig = {
  variant: GlowVariant;
  position?: string;
  opacity?: number;
};

const GLOW_COLORS: Record<GlowVariant, string> = {
  burgundy: "var(--fma-burgundy)",
  mauve: "var(--fma-mauve)",
  blue: "var(--fma-blue)",
  taupe: "var(--fma-taupe)",
};

export const SECTION_GLOWS = {
  default: [
    { variant: "burgundy", position: "18% 28%", opacity: 0.55 },
    { variant: "blue", position: "82% 72%", opacity: 0.38 },
  ],
  alt: [
    { variant: "mauve", position: "78% 22%", opacity: 0.48 },
    { variant: "taupe", position: "22% 78%", opacity: 0.42 },
  ],
  surface: [
    { variant: "burgundy", position: "50% 8%", opacity: 0.42 },
    { variant: "mauve", position: "92% 55%", opacity: 0.36 },
  ],
  hero: [
    { variant: "burgundy", position: "50% 35%", opacity: 0.45 },
    { variant: "blue", position: "20% 80%", opacity: 0.32 },
    { variant: "taupe", position: "88% 18%", opacity: 0.35 },
  ],
} as const satisfies Record<string, GlowConfig[]>;

export type GlowPreset = keyof typeof SECTION_GLOWS;

interface SectionGlowProps extends GlowConfig {
  className?: string;
}

export function SectionGlow({
  variant = "burgundy",
  position = "center",
  opacity = 0.5,
  className,
}: SectionGlowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 dark:[mix-blend-mode:soft-light]",
        className
      )}
      style={{
        backgroundImage: `radial-gradient(circle at ${position}, color-mix(in srgb, ${GLOW_COLORS[variant]} 30%, transparent) 0%, transparent 70%)`,
        opacity,
        mixBlendMode: "multiply",
      }}
      aria-hidden
    />
  );
}

interface SectionBackgroundProps {
  glows?: GlowPreset | GlowConfig[];
  className?: string;
  children: React.ReactNode;
}

export function SectionBackground({ glows = "default", className, children }: SectionBackgroundProps) {
  const configs = typeof glows === "string" ? SECTION_GLOWS[glows] : glows;

  return (
    <div className={cn("relative h-full w-full", className)}>
      {configs.map((glow, i) => (
        <SectionGlow key={`${glow.variant}-${i}`} {...glow} />
      ))}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
