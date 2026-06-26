import { cn } from "@/lib/utils";

/** Modale d’annonce — largeur généreuse, hauteur limitée, scroll interne sur petit écran. */
export const announcementDialogClass = cn(
  "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "flex w-[calc(100vw-1rem)] max-h-[min(92dvh,56rem)] flex-col overflow-y-auto overscroll-contain",
  "sm:w-[calc(100vw-2rem)] sm:max-w-xl",
  "md:max-w-2xl",
  "lg:max-w-3xl"
);

export const announcementHeaderClass = "shrink-0 px-4 py-4 sm:px-8 sm:py-5";

export const announcementBodyClass = "space-y-5 px-4 pb-5 sm:space-y-6 sm:px-8 sm:pb-8";

export const announcementImageWrapClass =
  "relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] sm:aspect-[2/1]";

export const announcementImageClass = "object-cover";

export const announcementImageSizes =
  "(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px";

/** Corps publication : couverture plein fond + actions en surimpression. */
export const announcementPublicationBodyClass = cn(
  "relative flex-1 overflow-hidden",
  "min-h-[min(52dvh,30rem)] md:min-h-[min(50dvh,34rem)]"
);

export const announcementPublicationCoverWrapClass = "absolute inset-0 bg-[var(--bg-alt)]";

export const announcementPublicationCoverImageClass = "object-cover object-center";

export const announcementPublicationCoverSizes =
  "(max-width: 640px) 100vw, (max-width: 1024px) 672px, 768px";

export const announcementPublicationFooterClass = cn(
  "absolute inset-x-0 bottom-0 z-10",
  "bg-gradient-to-t from-[var(--bg-surface)] via-[var(--bg-surface)]/95 to-transparent",
  "px-4 pb-5 pt-10 sm:px-8 sm:pb-8 sm:pt-12"
);

export const announcementPublicationActionsClass =
  "flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3";

export const announcementTitleClass =
  "pr-10 font-display text-lg font-bold leading-snug text-[var(--text-1)] sm:text-xl md:text-2xl";

export const announcementTextClass =
  "shrink-0 text-sm leading-relaxed text-[var(--text-2)] sm:text-base sm:leading-relaxed";

export const announcementActionsClass =
  "flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3";

export const announcementPrimaryActionClass = "w-full justify-center sm:w-auto";

export const announcementSecondaryActionClass = "w-full justify-center sm:w-auto";
