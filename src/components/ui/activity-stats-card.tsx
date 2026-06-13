"use client";

import * as React from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title?: string;
  metric: number;
  metricUnit?: string;
  metricPrefix?: string;
  subtext: string;
  iconContainerClassName?: string;
  /** Nombre de décimales affichées pendant l'animation. */
  decimals?: number;
  /** Locale pour le formatage (fr-FR par défaut). */
  locale?: string;
  /** Déclencher l'animation à l'entrée dans le viewport. */
  animateOnView?: boolean;
  /** Variante compacte centrée (sans titre). */
  compact?: boolean;
  /** Taille réduite pour plusieurs cartes sur une ligne. */
  dense?: boolean;
}

function formatMetricValue(value: number, decimals: number, locale: string): string {
  const loc = locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-FR";
  return value.toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      className,
      icon,
      title,
      metric,
      metricUnit,
      metricPrefix = "",
      subtext,
      iconContainerClassName,
      decimals = 2,
      locale = "fr",
      animateOnView = true,
      compact = false,
      dense = false,
      ...props
    },
    ref
  ) => {
    const metricRef = React.useRef<HTMLHeadingElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const [inView, setInView] = React.useState(!animateOnView);

    React.useEffect(() => {
      if (!animateOnView) return;
      const node = rootRef.current;
      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, [animateOnView]);

    React.useEffect(() => {
      const node = metricRef.current;
      if (!node || !inView) return;

      const controls = animate(0, metric, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = `${metricPrefix}${formatMetricValue(value, decimals, locale)}`;
        },
      });

      return () => controls.stop();
    }, [metric, metricPrefix, decimals, locale, inView]);

    const showTitle = Boolean(title?.trim());

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "flex w-full flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
          compact && "items-center text-center gap-3",
          compact && (dense ? "p-4 md:p-5" : "p-5 md:p-6"),
          className
        )}
        {...props}
      >
        {compact ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-primary text-primary-foreground",
              dense ? "h-9 w-9" : "h-11 w-11",
              iconContainerClassName
            )}
          >
            {icon}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
                iconContainerClassName
              )}
            >
              {icon}
            </div>
            {showTitle && <p className="text-lg font-medium text-foreground">{title}</p>}
          </div>
        )}

        <div className={cn("flex items-baseline gap-1", compact && "justify-center")}>
          <h2
            ref={metricRef}
            className={cn(
              "font-display font-bold tracking-tighter text-foreground tabular-nums",
              compact
                ? dense
                  ? "text-[clamp(1.25rem,2.2vw,2rem)] leading-none"
                  : "text-[clamp(1.75rem,3.2vw,2.75rem)] leading-none"
                : "text-5xl md:text-6xl"
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {metricPrefix}
            {formatMetricValue(0, decimals, locale)}
          </h2>
          {metricUnit && (
            <span
              className={cn(
                "font-bold text-muted-foreground",
                compact
                  ? dense
                    ? "text-[clamp(0.875rem,1.6vw,1.5rem)]"
                    : "text-[clamp(1.25rem,2.4vw,2rem)]"
                  : "text-4xl md:text-5xl"
              )}
            >
              {metricUnit}
            </span>
          )}
        </div>

        <p
          className={cn(
            "text-muted-foreground",
            compact
              ? dense
                ? "text-[0.6875rem] font-semibold leading-snug md:text-xs"
                : "text-xs font-semibold leading-snug md:text-sm"
              : "text-base"
          )}
        >
          {subtext}
        </p>
      </div>
    );
  }
);
StatsCard.displayName = "StatsCard";

export { StatsCard };
