"use client";

import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogCloseButton,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

const LABELS: Record<Locale, { view: string; download: string; openTab: string; close: string }> = {
  fr: { view: "Consulter le PDF", download: "Télécharger", openTab: "Ouvrir dans un nouvel onglet", close: "Fermer" },
  en: { view: "View PDF", download: "Download", openTab: "Open in new tab", close: "Close" },
  ar: { view: "عرض PDF", download: "تحميل", openTab: "فتح في تبويب جديد", close: "إغلاق" },
};

export function isPdfUrl(url: string): boolean {
  try {
    const path = new URL(url, "https://placeholder.local").pathname;
    return /\.pdf$/i.test(path);
  } catch {
    return /\.pdf(\?|#|$)/i.test(url);
  }
}

type PdfViewerModalProps = {
  url: string;
  title: string;
  locale: Locale;
  children: React.ReactNode;
  className?: string;
};

export function PdfViewerModal({ url, title, locale, children, className }: PdfViewerModalProps) {
  const t = LABELS[locale];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={cn("cursor-pointer text-left", className)}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "left-3 right-3 top-[calc(var(--header-h)+0.75rem)] bottom-3 w-auto max-w-6xl mx-auto",
          "h-[calc(100dvh-var(--header-h)-1.5rem)] max-h-none translate-x-0 translate-y-0",
          "border-0 bg-[var(--bg-surface)] p-0 shadow-2xl sm:left-6 sm:right-6 sm:bottom-6 sm:top-[calc(var(--header-h)+1rem)] sm:h-[calc(100dvh-var(--header-h)-2rem)]"
        )}
        aria-describedby={undefined}
      >
        <DialogCloseButton />
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader className="relative shrink-0 border-b border-[var(--border)] bg-[var(--bg-surface)] px-5 py-3 sm:px-6">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg-alt)] p-3 sm:p-4">
            <iframe
              src={`${url}#view=FitH`}
              title={title}
              className="pdf-frame-bg min-h-0 w-full flex-1 rounded-xl border border-[var(--border)] shadow-inner"
            />
            <div className="mt-3 flex shrink-0 flex-wrap items-center justify-end gap-2 sm:mt-4 sm:gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-2)] transition-colors hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
              {t.openTab}
            </a>
            <a href={url} download target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" type="button">
                <Download className="h-4 w-4" />
                {t.download}
              </Button>
            </a>
            <DialogClose asChild>
              <Button variant="primary" size="sm" type="button">
                {t.close}
              </Button>
            </DialogClose>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type LinkViewerModalProps = {
  url: string;
  title: string;
  locale: Locale;
  children: React.ReactNode;
  className?: string;
};

export function LinkViewerModal({ url, title, locale, children, className }: LinkViewerModalProps) {
  const t = LABELS[locale];

  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "left-3 right-3 top-[calc(var(--header-h)+0.75rem)] bottom-3 w-auto max-w-6xl mx-auto",
          "h-[calc(100dvh-var(--header-h)-1.5rem)] max-h-none translate-x-0 translate-y-0",
          "border-0 bg-[var(--bg-surface)] p-0 shadow-2xl sm:left-6 sm:right-6 sm:bottom-6 sm:top-[calc(var(--header-h)+1rem)] sm:h-[calc(100dvh-var(--header-h)-2rem)]"
        )}
        aria-describedby={undefined}
      >
        <DialogCloseButton />
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader className="relative shrink-0 border-b border-[var(--border)] bg-[var(--bg-surface)] px-5 py-3 sm:px-6">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg-alt)] p-3 sm:p-4">
            <iframe
              src={url}
              title={title}
              className="pdf-frame-bg min-h-0 w-full flex-1 rounded-xl border border-[var(--border)] shadow-inner"
            />
            <div className="mt-3 flex shrink-0 flex-wrap items-center justify-end gap-2 sm:mt-4 sm:gap-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-2)] transition-colors hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                {t.openTab}
              </a>
              <DialogClose asChild>
                <Button variant="primary" size="sm" type="button">
                  {t.close}
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PdfViewerLink({
  url,
  title,
  locale,
  className,
  icon: Icon = Download,
  label,
}: {
  url: string;
  title: string;
  locale: Locale;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
}) {
  const t = LABELS[locale];

  return (
    <PdfViewerModal url={url} title={title} locale={locale} className={className}>
      <span className="inline-flex items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-primary">
        <Icon className="h-4 w-4" />
        {label ?? t.view}
      </span>
    </PdfViewerModal>
  );
}
