"use client";

import * as React from "react";
import { animate } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KeyFigureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  metric: number;
  metricUnit?: string;
  metricPrefix?: string;
  caption: string;
  decimals?: number;
  locale?: string;
}

function formatMetricValue(value: number, decimals: number, locale: string): string {
  const loc = locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-FR";
  return value.toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export const KeyFigureCard = React.forwardRef<HTMLDivElement, KeyFigureCardProps>(
  (
    {
      className,
      label,
      metric,
      metricUnit,
      metricPrefix = "",
      caption,
      decimals = 1,
      locale = "fr",
      ...props
    },
    ref
  ) => {
    const metricRef = React.useRef<HTMLParagraphElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const [inView, setInView] = React.useState(false);

    React.useEffect(() => {
      const node = rootRef.current;
      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
      const node = metricRef.current;
      if (!node || !inView) return;

      const controls = animate(0, metric, {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
        onUpdate(value) {
          node.textContent = `${metricPrefix}${formatMetricValue(value, decimals, locale)}`;
        },
      });

      return () => controls.stop();
    }, [metric, metricPrefix, decimals, locale, inView]);

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "key-figure-bento-card group relative flex h-full min-h-[11.5rem] flex-col items-center justify-center text-center",
          className
        )}
        {...props}
      >
        <p className="mb-2 flex min-h-[2.75rem] items-center justify-center text-[0.8125rem] font-medium leading-snug text-[var(--text-2)] md:min-h-[3rem] md:text-sm">
          <span className="line-clamp-2">{label}</span>
        </p>

        <ChevronDown
          className="mb-2 h-4 w-4 text-[var(--blue)] opacity-80 transition-transform duration-300 group-hover:translate-y-0.5"
          strokeWidth={2.5}
          aria-hidden
        />

        <div className="mb-2 flex items-baseline justify-center gap-0.5">
          <p
            ref={metricRef}
            className="font-display text-[clamp(1.625rem,2.8vw,2.5rem)] font-bold leading-none tracking-tight text-[#2d3a4a] tabular-nums dark:text-[var(--text-1)]"
            aria-live="polite"
            aria-atomic="true"
          >
            {metricPrefix}
            {formatMetricValue(0, decimals, locale)}
          </p>
          {metricUnit && (
            <span className="text-[clamp(1.125rem,2vw,1.75rem)] font-bold leading-none text-[#2d3a4a] dark:text-[var(--text-1)]">
              {metricUnit}
            </span>
          )}
        </div>

        <p className="text-[0.6875rem] font-medium text-[var(--text-3)] md:text-xs">{caption}</p>
      </div>
    );
  }
);
KeyFigureCard.displayName = "KeyFigureCard";
