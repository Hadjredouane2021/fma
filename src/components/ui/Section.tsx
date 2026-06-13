import { cn } from "@/lib/utils";
import { SectionGlow, SECTION_GLOWS, type GlowConfig, type GlowPreset } from "./background-components";

type SectionVariant = "default" | "alt" | "surface";

const VARIANT_CLASSES: Record<SectionVariant, string> = {
  default: "bg-[var(--bg)]",
  alt: "bg-[var(--bg)]",
  surface: "bg-[var(--bg)]",
};

const VARIANT_GLOWS: Record<SectionVariant, GlowPreset | null> = {
  default: null,
  alt: null,
  surface: null,
};

const PADDING_CLASSES = {
  default: "section-padding",
  compact: "py-16",
  loose: "py-20 lg:py-24",
  none: "",
} as const;

interface SectionProps extends React.ComponentPropsWithoutRef<"section"> {
  variant?: SectionVariant;
  bordered?: "y" | "t" | "b" | "none";
  padding?: keyof typeof PADDING_CLASSES;
  glows?: GlowPreset | GlowConfig[] | false;
  container?: boolean;
  containerClassName?: string;
}

export function Section({
  variant = "default",
  bordered = "none",
  padding = "default",
  glows,
  container = true,
  containerClassName,
  className,
  children,
  ...props
}: SectionProps) {
  const borderClass =
    bordered === "y" ? "border-y border-[var(--border)]"
    : bordered === "t" ? "border-t border-[var(--border)]"
    : bordered === "b" ? "border-b border-[var(--border)]"
    : "";

  const glowPreset = glows === false ? null : glows ?? VARIANT_GLOWS[variant];
  const glowConfigs =
    glowPreset === null
      ? []
      : typeof glowPreset === "string"
        ? SECTION_GLOWS[glowPreset]
        : glowPreset;

  const inner = container ? (
    <div className={cn("container-custom relative z-[1]", containerClassName)}>{children}</div>
  ) : containerClassName ? (
    <div className={cn("relative z-[1]", containerClassName)}>{children}</div>
  ) : (
    children
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        PADDING_CLASSES[padding],
        VARIANT_CLASSES[variant],
        borderClass,
        className
      )}
      {...props}
    >
      {glowConfigs.map((glow, i) => (
        <SectionGlow key={`${glow.variant}-${i}`} {...glow} />
      ))}
      {inner}
    </section>
  );
}
