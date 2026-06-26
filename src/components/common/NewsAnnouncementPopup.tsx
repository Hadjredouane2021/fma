"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Megaphone } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { buttonBase, buttonPrimary, buttonSizes } from "@/lib/button-styles";
import { truncate, cn } from "@/lib/utils";
import type { AnnouncementPost } from "@/lib/posts-cache";
import type { Locale } from "@/types";
import {
  announcementActionsClass,
  announcementBodyClass,
  announcementDialogClass,
  announcementHeaderClass,
  announcementImageClass,
  announcementImageSizes,
  announcementImageWrapClass,
  announcementPrimaryActionClass,
  announcementSecondaryActionClass,
  announcementTextClass,
  announcementTitleClass,
} from "@/components/common/announcement-popup-ui";
import { useAnnouncementDialogOpen } from "@/components/common/useAnnouncementDialogOpen";

const STORAGE_KEY = "fma-news-announcement-dismissed";

type NewsAnnouncementPopupProps = {
  locale: Locale;
  announcement: AnnouncementPost | null;
  enabled?: boolean;
  onShown?: () => void;
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

export function NewsAnnouncementPopup({
  locale,
  announcement,
  enabled = true,
  onShown,
}: NewsAnnouncementPopupProps) {
  const dismissed = announcement ? isDismissed(announcement) : true;
  const { hydrated, open, setOpen } = useAnnouncementDialogOpen(
    enabled,
    Boolean(announcement),
    dismissed
  );

  useEffect(() => {
    if (open) onShown?.();
  }, [open, onShown]);

  if (!announcement || !hydrated) return null;

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
      <DialogContent className={announcementDialogClass}>
        <DialogCloseButton className="right-3 top-3 sm:right-5 sm:top-5" />
        <DialogHeader className={announcementHeaderClass}>
          <div className="mb-1 flex items-center gap-2 text-primary">
            <Megaphone className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-widest sm:text-sm">{badge}</span>
          </div>
          <DialogTitle className={announcementTitleClass}>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {excerpt
              ? excerpt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
              : title}
          </DialogDescription>
        </DialogHeader>

        <div className={announcementBodyClass}>
          {announcement.featuredImage ? (
            <div className={announcementImageWrapClass}>
              <Image
                src={announcement.featuredImage}
                alt=""
                fill
                className={announcementImageClass}
                sizes={announcementImageSizes}
                unoptimized={announcement.featuredImage.startsWith("/uploads")}
              />
            </div>
          ) : null}

          {excerpt ? (
            <p className={announcementTextClass}>
              {truncate(excerpt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), 360)}
            </p>
          ) : null}

          <div className={announcementActionsClass}>
            <Link
              href={href}
              onClick={() => handleOpenChange(false)}
              className={cn(
                buttonBase,
                buttonPrimary,
                buttonSizes.rounded.md,
                announcementPrimaryActionClass,
                "inline-flex items-center gap-2"
              )}
            >
              {readMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <DialogClose asChild>
              <Button variant="ghost" size="md" type="button" className={announcementSecondaryActionClass}>
                {closeLabel}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
