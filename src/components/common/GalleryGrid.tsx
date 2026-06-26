"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogCloseButton,
  DialogTitle,
} from "@/components/ui/Dialog";
import type { GalleryItem } from "@/lib/galleries";
import { localPublicImageUnoptimized } from "@/lib/utils";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const close = () => setOpenIndex(null);
  const go = (dir: 1 | -1) => {
    setOpenIndex((i) => (i === null ? null : (i + dir + items.length) % items.length));
  };

  const current = openIndex !== null ? items[openIndex] : null;
  const currentLink = current?.link?.trim();
  const isExternal = !!currentLink && /^https?:\/\//i.test(currentLink);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <button
            key={`${item.url}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm transition-shadow hover:shadow-card"
          >
            <Image
              src={item.url}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              unoptimized={localPublicImageUnoptimized(item.url)}
            />
          </button>
        ))}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-1.5rem)] sm:w-full max-w-lg sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto glass-panel border border-[var(--border)] shadow-card p-4 sm:p-6">
          <DialogCloseButton />
          <DialogTitle className="sr-only">Galerie photo</DialogTitle>
          {current && (
            <div className="relative">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
                <Image
                  src={current.url}
                  alt=""
                  fill
                  sizes="90vw"
                  className="object-contain"
                  unoptimized={localPublicImageUnoptimized(current.url)}
                />
              </div>

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Précédent"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-surface)]/80 text-[var(--text-1)] border border-[var(--border)] shadow-lg backdrop-blur-md transition-all hover:bg-[var(--bg-surface)] hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Suivant"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-surface)]/80 text-[var(--text-1)] border border-[var(--border)] shadow-lg backdrop-blur-md transition-all hover:bg-[var(--bg-surface)] hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {currentLink && (
                <div className="mt-4 flex justify-center">
                  {isExternal ? (
                    <a
                      href={currentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Lire la suite
                    </a>
                  ) : (
                    <Link
                      href={currentLink}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Lire la suite
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
