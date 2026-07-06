import Image from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_SITE_SPINNER, spinnerImageUnoptimized } from "@/lib/site-spinner";

type PageSpinnerProps = {
  /** Barre plein écran pendant une navigation client */
  overlay?: boolean;
  className?: string;
  label?: string;
  imageUrl?: string;
};

export function PageSpinner({
  overlay,
  className,
  label = "Chargement…",
  imageUrl = DEFAULT_SITE_SPINNER.imageUrl,
}: PageSpinnerProps) {
  return (
    <div
      className={cn(
        overlay
          ? "fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg)] px-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
          : "flex min-h-[min(50vh,480px)] w-full flex-1 items-center justify-center px-4 py-16 sm:py-20",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label || "Chargement"}
    >
      <div className="relative z-10 flex w-full max-w-xs flex-col items-center gap-4 sm:max-w-sm sm:gap-6">
        <div
          className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-36 sm:w-36 md:h-40 md:w-40"
          aria-hidden
        >
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]" />
          <Image
            src={imageUrl}
            alt=""
            width={128}
            height={128}
            className="relative z-10 h-auto max-h-20 w-auto max-w-[7rem] object-contain sm:max-h-24 sm:max-w-[8rem] md:max-h-28 md:max-w-[9.5rem]"
            priority
            unoptimized={spinnerImageUnoptimized(imageUrl)}
          />
        </div>
        {label ? (
          <span className="max-w-full text-center text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-3)] sm:tracking-[0.12em]">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
