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
          ? "fixed inset-0 z-[200] flex items-center justify-center bg-white"
          : "flex min-h-[min(50vh,480px)] w-full flex-1 items-center justify-center py-20",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label || "Chargement"}
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44" aria-hidden>
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[var(--border)] border-t-[var(--brand)] border-r-[var(--blue)] sm:border-4" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[var(--bg-surface)] p-3 shadow-sm sm:h-36 sm:w-36 sm:p-3.5">
            <Image
              src={imageUrl}
              alt=""
              width={128}
              height={128}
              className="h-auto max-h-24 w-auto max-w-[8rem] object-contain sm:max-h-28 sm:max-w-[9.5rem]"
              priority
              unoptimized={spinnerImageUnoptimized(imageUrl)}
            />
          </div>
        </div>
        {label ? (
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-3)]">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
