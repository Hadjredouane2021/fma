import Image from "next/image";
import { KeyFigures } from "@/components/common/KeyFigures";
import type { KeyFigure } from "@/types";

const DEFAULT_IMAGE = "/key-figures-growth.png";

interface KeyFiguresSectionProps {
  eyebrow: string;
  figures: KeyFigure[];
  locale: string;
  imageUrl?: string;
  figureCaption: string;
}

export function KeyFiguresSection({
  eyebrow,
  figures,
  locale,
  imageUrl,
  figureCaption,
}: KeyFiguresSectionProps) {
  const src = imageUrl?.trim() || DEFAULT_IMAGE;

  return (
    <section className="key-figures-section relative overflow-hidden section-padding border-y border-[var(--border)]">
      <div className="key-figures-section__glow" aria-hidden />
      <div className="container-custom relative z-[1]">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-12 xl:gap-16">
          <div className="key-figures-visual group relative mx-auto w-full max-w-lg lg:max-w-none lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <div className="key-figures-visual__frame relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#f3f5f8] to-[#e8edf2] dark:from-[var(--bg-surface)] dark:to-[var(--bg-alt)]">
              <Image
                src={src}
                alt=""
                fill
                className="object-contain object-center p-3 transition-transform duration-700 ease-out group-hover:scale-[1.015] sm:p-4 md:p-5"
                sizes="(max-width: 1024px) min(90vw, 34rem), 38vw"
                priority={false}
                unoptimized={src.startsWith("/uploads")}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]" />
            </div>
            <div className="key-figures-visual__ring" aria-hidden />
          </div>

          <div className="min-w-0">
            {eyebrow.trim() ? (
              <h2 className="key-figures-section__title mb-8 font-display text-xl font-bold uppercase tracking-[0.12em] text-[#3d4a5c] sm:mb-10 sm:text-2xl sm:tracking-[0.16em] dark:text-[var(--text-1)]">
                {eyebrow}
              </h2>
            ) : null}
            <KeyFigures figures={figures} caption={figureCaption} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
