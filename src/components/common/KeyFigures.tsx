"use client";

import { Fragment } from "react";
import { KeyFigureCard } from "@/components/ui/key-figure-card";
import { SECTION_HEADER_TITLE_CLASSES } from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils";
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

function isAcceptationEnReassurance(label: string): boolean {
  return (
    /acceptation/i.test(label) &&
    /réassurance|reassurance/i.test(label) &&
    !/exclusive/i.test(label)
  );
}

function isReassuranceExclusiveLabel(label: string): boolean {
  return (
    /réassurance\s+exclusive|reassurance\s+exclusive/i.test(label) ||
    /acceptations?\s*[-–]?\s*(réassurance|reassurance)\s+exclusive/i.test(label)
  );
}

type FigureUnit =
  | { type: "card"; figure: KeyFigure; index: number }
  | {
      type: "reinsurance-column";
      title: string;
      top: { figure: KeyFigure; index: number };
      stack: { figure: KeyFigure; index: number }[];
    }
  | { type: "stack"; title: string; figures: { figure: KeyFigure; index: number }[] };

function buildFigureUnits(figures: KeyFigure[]): FigureUnit[] {
  const units: FigureUnit[] = [];
  let i = 0;

  while (i < figures.length) {
    const fig = figures[i];
    const groupKey = fig.stackGroup?.trim();

    if (!groupKey) {
      units.push({ type: "card", figure: fig, index: i });
      i += 1;
      continue;
    }

    const stack: { figure: KeyFigure; index: number }[] = [{ figure: fig, index: i }];
    const title = fig.stackGroupTitle?.trim() || groupKey;
    i += 1;

    while (i < figures.length && figures[i].stackGroup?.trim() === groupKey) {
      stack.push({ figure: figures[i], index: i });
      i += 1;
    }

    units.push({ type: "stack", title, figures: sortStackFigures(stack) });
  }

  return mergeReinsuranceColumn(units);
}

function mergeReinsuranceColumn(units: FigureUnit[]): FigureUnit[] {
  const acceptUnitIdx = units.findIndex(
    (u) => u.type === "card" && isAcceptationEnReassurance(u.figure.label)
  );
  const stackUnitIdx = units.findIndex(
    (u) =>
      u.type === "stack" &&
      (/réassurance\s+exclusive|reassurance\s+exclusive/i.test(u.title) ||
        u.figures.some((f) => isReassuranceExclusiveLabel(f.figure.label)))
  );

  if (acceptUnitIdx === -1 || stackUnitIdx === -1) return units;

  const acceptUnit = units[acceptUnitIdx] as Extract<FigureUnit, { type: "card" }>;
  const stackUnit = units[stackUnitIdx] as Extract<FigureUnit, { type: "stack" }>;
  const insertAt = Math.min(acceptUnitIdx, stackUnitIdx);

  const merged: FigureUnit = {
    type: "reinsurance-column",
    title: stackUnit.title,
    top: { figure: acceptUnit.figure, index: acceptUnit.index },
    stack: stackUnit.figures,
  };

  const next = units.filter((_, i) => i !== acceptUnitIdx && i !== stackUnitIdx);
  next.splice(insertAt, 0, merged);
  return next;
}

function hasStackGroups(figures: KeyFigure[]): boolean {
  return figures.some((f) => Boolean(f.stackGroup?.trim()));
}

function applyReinsuranceStackFallback(figures: KeyFigure[]): KeyFigure[] {
  const acceptIdx = figures.findIndex((f) => isAcceptationEnReassurance(f.label));
  const exclusiveIdx = figures.findIndex((f) => isReassuranceExclusiveLabel(f.label));
  if (acceptIdx === -1 || exclusiveIdx === -1) return figures;

  const title = "RÉASSURANCE EXCLUSIVE";
  const groupKey = "reassurance-exclusive";

  const acceptGrouped = figures[acceptIdx].stackGroup?.trim() === groupKey;
  const exclusiveGrouped = figures[exclusiveIdx].stackGroup?.trim() === groupKey;
  if (acceptGrouped && exclusiveGrouped) {
    return reorderAcceptBeforeExclusive(figures, acceptIdx, exclusiveIdx);
  }

  if (hasStackGroups(figures) && (acceptGrouped || exclusiveGrouped)) {
    return reorderAcceptBeforeExclusive(figures, acceptIdx, exclusiveIdx);
  }

  if (hasStackGroups(figures)) return figures;

  const patched = figures.map((f, i) =>
    i === exclusiveIdx ? { ...f, stackGroup: groupKey, stackGroupTitle: title } : f
  );

  const exclusive = patched[exclusiveIdx];
  const accept = patched[acceptIdx];
  const rest = patched.filter((_, i) => i !== exclusiveIdx && i !== acceptIdx);
  const insertAt = Math.min(exclusiveIdx, acceptIdx);
  const ordered = [...rest];
  ordered.splice(insertAt, 0, accept, exclusive);
  return ordered;
}

function reorderAcceptBeforeExclusive(
  figures: KeyFigure[],
  acceptIdx: number,
  exclusiveIdx: number
): KeyFigure[] {
  if (acceptIdx < exclusiveIdx && exclusiveIdx - acceptIdx === 1) return figures;
  const accept = figures[acceptIdx];
  const exclusive = figures[exclusiveIdx];
  const rest = figures.filter((_, i) => i !== acceptIdx && i !== exclusiveIdx);
  const insertAt = Math.min(acceptIdx, exclusiveIdx);
  const ordered = [...rest];
  ordered.splice(insertAt, 0, accept, exclusive);
  return ordered;
}

function sortStackFigures(
  items: { figure: KeyFigure; index: number }[]
): { figure: KeyFigure; index: number }[] {
  return [...items].sort((a, b) => {
    const aAccept = isAcceptationEnReassurance(a.figure.label);
    const bAccept = isAcceptationEnReassurance(b.figure.label);
    if (aAccept && !bAccept) return -1;
    if (!aAccept && bAccept) return 1;
    const aExclusive = isReassuranceExclusiveLabel(a.figure.label);
    const bExclusive = isReassuranceExclusiveLabel(b.figure.label);
    if (aExclusive && !bExclusive) return 1;
    if (!aExclusive && bExclusive) return -1;
    return a.index - b.index;
  });
}

function usesGroupedLayout(figures: KeyFigure[]): boolean {
  if (hasStackGroups(figures)) return true;
  return (
    figures.some((f) => isAcceptationEnReassurance(f.label)) &&
    figures.some((f) => isReassuranceExclusiveLabel(f.label))
  );
}

interface KeyFiguresProps {
  figures: KeyFigure[];
  caption: string;
  locale?: string;
}

export function KeyFigures({ figures, caption, locale = "fr" }: KeyFiguresProps) {
  const displayFigures = applyReinsuranceStackFallback(figures);

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
      description={fig.description}
    />
  );

  const gridClass = "grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5";

  if (!usesGroupedLayout(displayFigures)) {
    const topRow = displayFigures.slice(0, 2);
    const bottomRow = displayFigures.slice(2);

    if (displayFigures.length <= 2) {
      return (
        <div className={gridClass}>
          {displayFigures.map((fig, i) => renderCard(fig, i))}
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

  const units = buildFigureUnits(displayFigures);

  return (
    <div className={gridClass}>
      {units.map((unit, unitIndex) => {
        if (unit.type === "card") {
          return <div key={`card-${unit.index}`}>{renderCard(unit.figure, unit.index)}</div>;
        }

        if (unit.type === "reinsurance-column") {
          return (
            <Fragment key={`reinsurance-column-${unitIndex}`}>
              <div className="sm:col-span-2 mx-auto w-full max-w-md">
                {renderCard(unit.top.figure, unit.top.index)}
              </div>
              <h4
                className={cn(
                  "key-figures-section__title mb-3 w-full text-start sm:col-span-2 sm:mb-4",
                  SECTION_HEADER_TITLE_CLASSES,
                  "whitespace-nowrap text-[25px] leading-snug"
                )}
              >
                {unit.title}
              </h4>
              <div className="flex flex-col gap-4 sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-md md:gap-5">
                {unit.stack.map(({ figure, index }) => renderCard(figure, index))}
              </div>
            </Fragment>
          );
        }

        return (
          <div key={`stack-${unitIndex}-${unit.title}`} className="flex h-full flex-col gap-3 sm:gap-4">
            <h3 className="text-center text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-primary md:text-xs">
              {unit.title}
            </h3>
            <div className="flex flex-1 flex-col gap-4 md:gap-5">
              {unit.figures.map(({ figure, index }) => renderCard(figure, index))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
