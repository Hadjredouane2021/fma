"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { localPublicImageUnoptimized } from "@/lib/utils";

export type ConseilFmaItem = { url: string; link?: string; title?: string };

const DEFAULT_ITEMS: ConseilFmaItem[] = [];

const AUTOPLAY_MS = 5000;

function SlideImage({
  item,
  index,
  priority,
  imageAltPrefix,
  onAspectRatio,
}: {
  item: ConseilFmaItem;
  index: number;
  priority?: boolean;
  imageAltPrefix: string;
  onAspectRatio: (ratio: number) => void;
}) {
  const link = item.link?.trim();
  const isExternal = !!link && /^https?:\/\//i.test(link);

  return (
    <div className="absolute inset-3 sm:inset-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[#f3f5f8] to-[#e8edf2] shadow-sm dark:from-[var(--bg-surface)] dark:to-[var(--bg-alt)]">
      <Image
        src={item.url}
        alt={`${imageAltPrefix} ${index + 1}`}
        fill
        sizes="(max-width: 768px) 92vw, (max-width: 1024px) 70vw, 56rem"
        className="object-contain object-center p-3 sm:p-4 md:p-5"
        priority={priority}
        unoptimized={localPublicImageUnoptimized(item.url)}
        onLoad={(event) => {
          const img = event.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            onAspectRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]" />

      {link && (
        <div className="absolute inset-x-0 bottom-0 flex justify-start bg-gradient-to-t from-black/50 to-transparent p-4">
          {isExternal ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Lire la suite
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <Link
              href={link}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Lire la suite
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function ConseilFmaCarousel({
  items,
  imageAltPrefix = "Le conseil FMA",
}: {
  items?: ConseilFmaItem[];
  imageAltPrefix?: string;
}) {
  const ITEMS = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (paused || ITEMS.length <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % ITEMS.length);
      setProgressKey((k) => k + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [ITEMS.length, paused]);

  if (ITEMS.length === 0) return null;

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((i) => (i + dir + ITEMS.length) % ITEMS.length);
    setProgressKey((k) => k + 1);
  };

  const goTo = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
    setProgressKey((k) => k + 1);
  };

  const handleAspectRatio = (slideIndex: number) => (ratio: number) => {
    if (slideIndex === index) setAspectRatio(ratio);
  };

  const prevIdx = (index - 1 + ITEMS.length) % ITEMS.length;
  const nextIdx = (index + 1) % ITEMS.length;
  const showSidePreviews = ITEMS.length > 1;

  return (
    <div
      className="relative mx-auto w-full max-w-7xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex items-center justify-center gap-3 sm:gap-4 lg:gap-6">
        {/* Previous preview (lg+) */}
        {showSidePreviews && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Image précédente"
            className="group relative hidden lg:block aspect-square w-[14%] shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] opacity-50 saturate-50 transition-all duration-500 hover:opacity-80 hover:saturate-100"
          >
            <Image
              src={ITEMS[prevIdx].url}
              alt=""
              fill
              sizes="14vw"
              className="object-contain object-center p-2 scale-105 transition-transform duration-700 group-hover:scale-100"
              unoptimized={localPublicImageUnoptimized(ITEMS[prevIdx].url)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/40 to-transparent" />
          </button>
        )}

        {/* Main stage */}
        <div className="relative w-full max-w-4xl lg:flex-1">
          <div
            className="relative overflow-hidden rounded-3xl border border-[var(--border)] shadow-card glass-panel transition-[aspect-ratio] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ aspectRatio: Math.min(Math.max(aspectRatio, 0.6), 1.8) }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, scale: 1.04, x: direction > 0 ? 40 : -40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: direction > 0 ? -40 : 40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <SlideImage
                  item={ITEMS[index]}
                  index={index}
                  priority={index === 0}
                  imageAltPrefix={imageAltPrefix}
                  onAspectRatio={handleAspectRatio(index)}
                />
              </motion.div>
            </AnimatePresence>

            {/* Glass arrow controls */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Précédent"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-surface)]/80 text-[var(--text-1)] border border-[var(--border)] shadow-lg backdrop-blur-md transition-all hover:bg-[var(--bg-surface)] hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Suivant"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-surface)]/80 text-[var(--text-1)] border border-[var(--border)] shadow-lg backdrop-blur-md transition-all hover:bg-[var(--bg-surface)] hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Counter badge */}
            <div className="absolute right-4 top-4 z-10 rounded-full bg-[var(--bg-surface)]/80 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--text-1)] backdrop-blur-md border border-[var(--border)]">
              {index + 1} / {ITEMS.length}
            </div>
          </div>
          {ITEMS[index].title?.trim() && (
            <p className="mt-3 text-center text-sm font-semibold text-[var(--text-1)] sm:text-base">
              {ITEMS[index].title}
            </p>
          )}
        </div>

        {/* Next preview (lg+) */}
        {showSidePreviews && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Image suivante"
            className="group relative hidden lg:block aspect-square w-[14%] shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] opacity-50 saturate-50 transition-all duration-500 hover:opacity-80 hover:saturate-100"
          >
            <Image
              src={ITEMS[nextIdx].url}
              alt=""
              fill
              sizes="14vw"
              className="object-contain object-center p-2 scale-105 transition-transform duration-700 group-hover:scale-100"
              unoptimized={localPublicImageUnoptimized(ITEMS[nextIdx].url)}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[var(--bg)]/40 to-transparent" />
          </button>
        )}
      </div>

      {/* Progress-bar pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {ITEMS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Aller à l'image ${i + 1}`}
            onClick={() => goTo(i)}
            className="group relative h-1.5 w-8 overflow-hidden rounded-full bg-[var(--border)]"
          >
            {i === index && (
              <motion.span
                key={progressKey}
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--brand)]"
                initial={{ width: "0%" }}
                animate={{ width: paused ? "0%" : "100%" }}
                transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
              />
            )}
            {i < index && <span className="absolute inset-0 rounded-full bg-[var(--brand)]" />}
            <span className="absolute inset-0 rounded-full bg-transparent group-hover:bg-[var(--brand)]/20 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
