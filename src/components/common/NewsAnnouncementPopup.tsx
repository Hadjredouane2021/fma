"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Megaphone } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { buttonBase, buttonPrimary, buttonSizes } from "@/lib/button-styles";
import { truncate, cn } from "@/lib/utils";
import type { AnnouncementPost } from "@/lib/posts-cache";
import type { Locale } from "@/types";

const STORAGE_KEY = "fma-news-announcement-dismissed";

type NewsAnnouncementPopupProps = {
  locale: Locale;
  announcement: AnnouncementPost | null;
};

function localized(
  announcement: AnnouncementPost,
  locale: Locale,
  field: "title" | "excerpt"
): string {
  if (field === "title") {
    if (locale === "ar") return announcement.titleAr || announcement.titleFr;
    if (locale === "en") return announcement.titleEn || announcement.titleFr;
    return announcement.titleFr;
  }
  if (locale === "ar") return announcement.excerptAr || announcement.excerptFr || "";
  if (locale === "en") return announcement.excerptEn || announcement.excerptFr || "";
  return announcement.excerptFr || "";
}

function isDismissed(announcement: AnnouncementPost): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { id?: string; updatedAt?: string };
    return (
      parsed.id === announcement.id &&
      parsed.updatedAt === new Date(announcement.updatedAt).toISOString()
    );
  } catch {
    return false;
  }
}

function dismiss(announcement: AnnouncementPost) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      id: announcement.id,
      updatedAt: new Date(announcement.updatedAt).toISOString(),
    })
  );
}

export function NewsAnnouncementPopup({ locale, announcement }: NewsAnnouncementPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!announcement || isDismissed(announcement)) return;
    const timer = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [announcement]);

  if (!announcement) return null;

  const title = localized(announcement, locale, "title");
  const excerpt = localized(announcement, locale, "excerpt");
  const href = `/${locale}/actualites/${announcement.slug}`;
  const badge = locale === "ar" ? "إعلان" : locale === "en" ? "Announcement" : "Annonce";
  const readMore = locale === "ar" ? "اقرأ المزيد" : locale === "en" ? "Read more" : "Lire la suite";
  const closeLabel = locale === "ar" ? "إغلاق" : locale === "en" ? "Close" : "Fermer";

  const handleOpenChange = (next: boolean) => {
    if (!next) dismiss(announcement);
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="left-1/2 top-1/2 max-h-[90vh] w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto sm:max-w-lg">
        <DialogCloseButton />
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2 text-primary">
            <Megaphone className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-widest">{badge}</span>
          </div>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
          {announcement.featuredImage ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-alt)]">
              <Image
                src={announcement.featuredImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 480px"
                unoptimized={announcement.featuredImage.startsWith("/uploads")}
              />
            </div>
          ) : null}

          {excerpt ? (
            <p className="text-sm leading-relaxed text-[var(--text-2)]">
              {truncate(excerpt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), 220)}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={href}
              onClick={() => handleOpenChange(false)}
              className={cn(buttonBase, buttonPrimary, buttonSizes.rounded.md, "inline-flex items-center gap-2")}
            >
              {readMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <DialogClose asChild>
              <Button variant="ghost" size="md" type="button">
                {closeLabel}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
