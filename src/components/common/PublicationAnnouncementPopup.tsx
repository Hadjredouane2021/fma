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
import { isPdfUrl } from "@/components/common/PdfViewerModal";
import { truncate, cn } from "@/lib/utils";
import { localizedText } from "@/lib/localized-content";
import type { AnnouncementPublication } from "@/lib/publications-cache";
import type { Locale } from "@/types";
import {
  announcementDialogClass,
  announcementHeaderClass,
  announcementPrimaryActionClass,
  announcementPublicationActionsClass,
  announcementPublicationBodyClass,
  announcementPublicationCoverImageClass,
  announcementPublicationCoverSizes,
  announcementPublicationCoverWrapClass,
  announcementPublicationFooterClass,
  announcementSecondaryActionClass,
  announcementTextClass,
  announcementTitleClass,
} from "@/components/common/announcement-popup-ui";
import { useAnnouncementDialogOpen } from "@/components/common/useAnnouncementDialogOpen";

const STORAGE_KEY = "fma-publication-announcement-dismissed";

type PublicationAnnouncementPopupProps = {
  locale: Locale;
  announcement: AnnouncementPublication | null;
  enabled?: boolean;
  onShown?: () => void;
};

function localized(
  announcement: AnnouncementPublication,
  locale: Locale,
  field: "title" | "description"
): string {
  if (field === "title") {
    return localizedText(
      { fr: announcement.titleFr, en: announcement.titleEn, ar: announcement.titleAr },
      locale
    );
  }
  return localizedText(
    {
      fr: announcement.descriptionFr,
      en: announcement.descriptionEn,
      ar: announcement.descriptionAr,
    },
    locale
  );
}

function isDismissed(announcement: AnnouncementPublication): boolean {
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

function dismiss(announcement: AnnouncementPublication) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      id: announcement.id,
      updatedAt: new Date(announcement.updatedAt).toISOString(),
    })
  );
}

function resolveCta(announcement: AnnouncementPublication, locale: Locale) {
  const readMore = localizedText(
    {
      fr: announcement.readMoreUrlFr,
      en: announcement.readMoreUrlEn,
      ar: announcement.readMoreUrlAr,
    },
    locale
  ).trim();
  const pdfFile = localizedText(
    {
      fr: announcement.pdfFileFr,
      en: announcement.pdfFileEn,
      ar: announcement.pdfFileAr,
    },
    locale
  ).trim();
  if (readMore && !isPdfUrl(readMore)) {
    return {
      href: readMore,
      external: true,
      label: locale === "ar" ? "اقرأ المزيد" : locale === "en" ? "Read more" : "Lire la suite",
    };
  }
  if (pdfFile) {
    return {
      href: pdfFile,
      external: true,
      label: locale === "ar" ? "عرض PDF" : locale === "en" ? "View PDF" : "Consulter le PDF",
    };
  }
  return {
    href: `/${locale}/publications`,
    external: false,
    label: locale === "ar" ? "عرض المنشورات" : locale === "en" ? "View publications" : "Voir les publications",
  };
}

export function PublicationAnnouncementPopup({
  locale,
  announcement,
  enabled = true,
  onShown,
}: PublicationAnnouncementPopupProps) {
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
  const description = localized(announcement, locale, "description");
  const cta = resolveCta(announcement, locale);
  const badge =
    locale === "ar" ? "إعلان" : locale === "en" ? "Publication" : "Publication";
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
            {description && description !== title
              ? description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
              : title}
          </DialogDescription>
        </DialogHeader>

        <div className={announcementPublicationBodyClass}>
          {announcement.coverImage ? (
            <div className={announcementPublicationCoverWrapClass}>
              <Image
                src={announcement.coverImage}
                alt=""
                fill
                className={announcementPublicationCoverImageClass}
                sizes={announcementPublicationCoverSizes}
                priority
                unoptimized={announcement.coverImage.startsWith("/uploads")}
              />
            </div>
          ) : null}

          <div className={announcementPublicationFooterClass}>
            {description && description !== title ? (
              <p className={cn(announcementTextClass, "mb-4 text-[var(--text-1)]")}>
                {truncate(description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), 200)}
              </p>
            ) : null}

            <div className={announcementPublicationActionsClass}>
            {cta.external ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOpenChange(false)}
                className={cn(
                  buttonBase,
                  buttonPrimary,
                  buttonSizes.rounded.md,
                  announcementPrimaryActionClass,
                  "inline-flex items-center gap-2"
                )}
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <Link
                href={cta.href}
                onClick={() => handleOpenChange(false)}
                className={cn(
                  buttonBase,
                  buttonPrimary,
                  buttonSizes.rounded.md,
                  announcementPrimaryActionClass,
                  "inline-flex items-center gap-2"
                )}
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <DialogClose asChild>
              <Button variant="ghost" size="md" type="button" className={announcementSecondaryActionClass}>
                {closeLabel}
              </Button>
            </DialogClose>
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
