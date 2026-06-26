import Image from "next/image";
import { KeyFigures } from "@/components/common/KeyFigures";
import { KeyFigureCard } from "@/components/ui/key-figure-card";
import { localPublicImageUnoptimized, cn } from "@/lib/utils";
import { SECTION_HEADER_TITLE_CLASSES } from "@/components/common/SectionHeader";
import type { KeyFigure } from "@/types";

const DEFAULT_IMAGE = "/key-figures-growth.png";

interface GlobalFigure {
  value: string;
  suffix: string;
  label: string;
  description: string;
}

interface KeyFiguresSectionProps {
  eyebrow?: string;
  figures: KeyFigure[];
  locale: string;
  imageUrl?: string;
  figureCaption?: string;
  globalFigure?: GlobalFigure;
}

function parseFigureMetric(value: string): number {
  const cleaned = value.replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(cleaned.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function KeyFiguresSection({
  eyebrow = "",
  figures,
  locale,
  imageUrl,
  figureCaption = "",
  globalFigure,
}: KeyFiguresSectionProps) {
  const src = imageUrl?.trim() || DEFAULT_IMAGE;

  return (
    <section className="key-figures-section relative overflow-hidden section-padding border-y border-[var(--border)]">
      <div className="key-figures-section__glow" aria-hidden />
      <div className="container-custom relative z-[1]">
        {eyebrow.trim() ? (
          <div className="mb-8 text-start sm:mb-10 lg:mb-14 xl:mb-16">
            <h2 className={cn("key-figures-section__title", SECTION_HEADER_TITLE_CLASSES)}>
              {eyebrow}
            </h2>
          </div>
        ) : null}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-12 xl:gap-16">
          <div className="key-figures-visual group relative mx-auto w-full max-w-lg lg:mx-0 lg:h-full lg:max-w-none">
            <div className="key-figures-visual__frame relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#f3f5f8] to-[#e8edf2] dark:from-[var(--bg-surface)] dark:to-[var(--bg-alt)] lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-none">
              <Image
                src={src}
                alt=""
                fill
                className="key-figures-visual__img object-contain object-center p-3 transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:p-4 lg:p-2 xl:p-3"
                sizes="(max-width: 1024px) min(90vw, 34rem), 48vw"
                priority={false}
                unoptimized={localPublicImageUnoptimized(src)}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]" />
            </div>
            <div className="key-figures-visual__ring" aria-hidden />
          </div>

          <div className="min-w-0">
            {globalFigure && (
              <div className="mx-auto mb-4 w-full max-w-md md:mb-5">
                <KeyFigureCard
                  label={globalFigure.label}
                  metric={parseFigureMetric(globalFigure.value)}
                  metricUnit={globalFigure.suffix}
                  caption={figureCaption}
                  decimals={globalFigure.value.includes(",") || globalFigure.value.includes(".") ? 1 : 0}
                  locale={locale}
                  description={globalFigure.description}
                />
              </div>
            )}
            <KeyFigures figures={figures} caption={figureCaption} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
