"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Images } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogCloseButton,
  DialogTitle,
} from "@/components/ui/Dialog";
import { localizedText } from "@/lib/localized-content";
import { getFolderCoverUrl, type FolderGalleryCategory, type GalleryFolder } from "@/lib/galleries";
import { cn, localPublicImageUnoptimized } from "@/lib/utils";
import type { Locale } from "@/types";

type GalleryFolderListProps = {
  folders: GalleryFolder[];
  locale: Locale;
  category?: FolderGalleryCategory;
};

function isSocialGallery(category?: FolderGalleryCategory) {
  return category === "reseaux-sociaux";
}

function localizedHtml(folder: GalleryFolder, locale: Locale): string {
  return localizedText(
    { fr: folder.description.fr, en: folder.description.en, ar: folder.description.ar },
    locale
  );
}

function localizedTitle(folder: GalleryFolder, locale: Locale): string {
  return localizedText(
    { fr: folder.title.fr, en: folder.title.en, ar: folder.title.ar },
    locale
  );
}

function folderLabels(locale: Locale) {
  if (locale === "ar") {
    return {
      viewAll: (n: number) => (n > 1 ? `عرض كل الصور (${n})` : "عرض الصورة"),
      noDescription: "لا يوجد وصف",
      prev: "السابق",
      next: "التالي",
      readMore: "اقرأ المزيد",
      photos: "الصور",
      photoCount: (n: number) => `${n} صور`,
    };
  }
  if (locale === "en") {
    return {
      viewAll: (n: number) => (n > 1 ? `View all photos (${n})` : "View photo"),
      noDescription: "No description",
      prev: "Previous",
      next: "Next",
      readMore: "Read more",
      photos: "Photos",
      photoCount: (n: number) => `${n} photos`,
    };
  }
  return {
    viewAll: (n: number) => (n > 1 ? `Voir toutes les photos (${n})` : "Voir la photo"),
    noDescription: "Aucune description",
    prev: "Précédent",
    next: "Suivant",
    readMore: "Lire la suite",
    photos: "Photos",
    photoCount: (n: number) => `${n} photos`,
  };
}

function FolderGalleryModal({
  folder,
  locale,
  initialIndex,
  open,
  onClose,
  social,
}: {
  folder: GalleryFolder;
  locale: Locale;
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  social?: boolean;
}) {
  const [index, setIndex] = useState(initialIndex);
  const labels = folderLabels(locale);
  const title = localizedTitle(folder, locale);
  const items = folder.items;

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const go = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + items.length) % items.length);
  };

  const current = items[index];
  const currentLink = current?.link?.trim();
  const isExternal = !!currentLink && /^https?:\/\//i.test(currentLink);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
        else setIndex(initialIndex);
      }}
    >
      <DialogContent className="left-1/2 top-1/2 max-h-[90vh] w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-card sm:w-full sm:max-w-2xl sm:p-6 lg:max-w-4xl">
        <DialogCloseButton />
        <DialogTitle className="mb-4 pr-8 text-lg sm:text-xl">
          {title || labels.photos}
        </DialogTitle>

        {current && (
          <div className="relative mb-4">
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)]",
                social ? "aspect-[4/5] max-h-[70vh] sm:aspect-square" : "aspect-[4/3]"
              )}
            >
              <Image
                src={current.url}
                alt=""
                fill
                sizes="90vw"
                className={social ? "object-contain object-center p-3 sm:p-4" : "object-contain"}
                unoptimized={localPublicImageUnoptimized(current.url)}
                priority
              />
            </div>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={labels.prev}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/90 text-[var(--text-1)] shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-[var(--bg-surface)] active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={labels.next}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/90 text-[var(--text-1)] shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-[var(--bg-surface)] active:scale-95"
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
                    {labels.readMore}
                  </a>
                ) : (
                  <Link
                    href={currentLink}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {labels.readMore}
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {items.length > 1 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              {labels.photos} ({items.length})
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {items.map((item, i) => (
                <button
                  key={`${item.url}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${
                    i === index
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-[var(--border)] hover:border-primary/40"
                  }`}
                >
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="80px"
                    className={social ? "object-contain p-0.5" : "object-cover"}
                    unoptimized={localPublicImageUnoptimized(item.url)}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function GalleryFolderList({ folders, locale, category }: GalleryFolderListProps) {
  const social = isSocialGallery(category);
  const [openFolder, setOpenFolder] = useState<GalleryFolder | null>(null);
  const [openIndex, setOpenIndex] = useState(0);
  const labels = folderLabels(locale);
  const visible = folders.filter((folder) => folder.items.length > 0);
  if (visible.length === 0) return null;

  const openGallery = (folder: GalleryFolder, index = 0) => {
    setOpenFolder(folder);
    setOpenIndex(index);
  };

  const coverIndex = (folder: GalleryFolder) => {
    const idx = folder.items.findIndex((item) => item.isCover);
    return idx >= 0 ? idx : 0;
  };

  return (
    <>
      <div className="space-y-8 md:space-y-10">
        {visible.map((folder) => {
          const coverUrl = getFolderCoverUrl(folder);
          const title = localizedTitle(folder, locale);
          const html = localizedHtml(folder, locale);
          const photoCount = folder.items.length;
          if (!coverUrl) return null;

          return (
            <article
              key={folder.id}
              className="grid items-stretch gap-5 sm:gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8"
            >
              <button
                type="button"
                onClick={() => openGallery(folder, coverIndex(folder))}
                className={cn(
                  "group relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] shadow-sm transition-shadow hover:shadow-card lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-none",
                  social
                    ? "aspect-[4/5] bg-gradient-to-br from-[#f3f5f8] to-[#e8edf2] dark:from-[var(--bg-surface)] dark:to-[var(--bg-alt)] sm:aspect-square lg:min-h-[18rem]"
                    : "aspect-[4/3] bg-[var(--bg-surface)] lg:min-h-[14rem]"
                )}
              >
                <Image
                  src={coverUrl}
                  alt={title || ""}
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className={cn(
                    "transition-transform duration-500",
                    social
                      ? "object-contain object-center p-3 sm:p-4 md:p-5"
                      : "object-cover object-center group-hover:scale-[1.02]"
                  )}
                  unoptimized={localPublicImageUnoptimized(coverUrl)}
                />
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]" />
                {photoCount > 1 && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                      <Images className="h-3.5 w-3.5" />
                      {labels.photoCount(photoCount)}
                    </span>
                  </div>
                )}
              </button>

              <div className="min-w-0 py-0">
                {title ? (
                  <h2 className="mb-2 font-display text-xl font-bold tracking-tight text-[var(--text-1)] sm:text-2xl">
                    {title}
                  </h2>
                ) : null}
                {html ? (
                  <div
                    className="prose-fma leading-normal [&_h2]:!mb-1.5 [&_h2]:!mt-2 [&_h3]:!mb-1 [&_h3]:!mt-2 [&_li]:!my-0 [&_ol]:!mb-1.5 [&_ol]:!mt-1.5 [&_p]:!mb-1 [&_p]:!mt-0 [&_p:last-child]:!mb-0 [&_ul]:!mb-1.5 [&_ul]:!mt-1.5"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ) : (
                  <p className="text-sm text-[var(--text-3)]">{labels.noDescription}</p>
                )}
                {photoCount > 0 && (
                  <button
                    type="button"
                    onClick={() => openGallery(folder, coverIndex(folder))}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-accent transition-all hover:gap-3"
                  >
                    <Images className="h-4 w-4" />
                    {labels.viewAll(photoCount)}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {openFolder && (
        <FolderGalleryModal
          folder={openFolder}
          locale={locale}
          initialIndex={openIndex}
          open={openFolder !== null}
          onClose={() => setOpenFolder(null)}
          social={social}
        />
      )}
    </>
  );
}
