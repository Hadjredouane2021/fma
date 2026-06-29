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
        <div className="relative flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40" aria-hidden>
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]" />
          <Image
            src={imageUrl}
            alt=""
            width={128}
            height={128}
            className="relative z-10 h-auto max-h-24 w-auto max-w-[8rem] object-contain sm:max-h-28 sm:max-w-[9.5rem]"
            priority
            unoptimized={spinnerImageUnoptimized(imageUrl)}
          />
        </div>
        {label ? (
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-3)]">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
