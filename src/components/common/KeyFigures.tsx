"use client";

import { KeyFigureCard } from "@/components/ui/key-figure-card";
import type { KeyFigure } from "@/types";

function parseFigureMetric(value: string): number {
  const cleaned = value.replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(cleaned.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function figureDecimals(fig: KeyFigure): number {
  if (fig.suffix?.includes("%")) return 1;
  if (fig.value.includes(",") || fig.value.includes(".")) return 1;
  return 0;
}

interface KeyFiguresProps {
  figures: KeyFigure[];
  caption: string;
  locale?: string;
}

export function KeyFigures({ figures, caption, locale = "fr" }: KeyFiguresProps) {
  const topRow = figures.slice(0, 2);
  const bottomRow = figures.slice(2);

  const renderCard = (fig: KeyFigure, index: number) => (
    <KeyFigureCard
      key={`${fig.label}-${index}`}
      className="h-full"
      label={fig.label}
      metric={parseFigureMetric(fig.value)}
      metricUnit={fig.suffix}
      metricPrefix={fig.prefix}
      caption={caption}
      decimals={figureDecimals(fig)}
      locale={locale}
    />
  );

  const gridClass = "grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5";

  if (figures.length <= 2) {
    return (
      <div className={gridClass}>
        {figures.map((fig, i) => renderCard(fig, i))}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-5">
      {topRow.length > 0 && (
        <div className={gridClass}>
          {topRow.map((fig, i) => renderCard(fig, i))}
        </div>
      )}
      {bottomRow.length > 0 && (
        <div
          className="grid items-stretch gap-4 md:gap-5"
          style={{ gridTemplateColumns: `repeat(${Math.min(bottomRow.length, 3)}, minmax(0, 1fr))` }}
        >
          {bottomRow.map((fig, i) => renderCard(fig, i + topRow.length))}
        </div>
      )}
    </div>
  );
}
