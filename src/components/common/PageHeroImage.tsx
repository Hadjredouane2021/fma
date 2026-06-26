import Image from "next/image";
import { cn } from "@/lib/utils";

type PageHeroImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  overlay?: boolean;
};

/** Bandeau image PageHero — ratio 37:10 (500 × 162 px) */
export function PageHeroImage({
  src,
  alt,
  priority = true,
  className,
  overlay = false,
}: PageHeroImageProps) {
  return (
    <div
      className={cn(
        "page-hero-image relative mt-2 w-full overflow-hidden border border-[var(--border)] bg-[var(--bg-alt)] sm:mt-4",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="page-hero-image__img"
        sizes="(max-width: 640px) 100vw, (max-width: 1023px) calc(100vw - 3rem), 1280px"
        priority={priority}
        unoptimized={src.startsWith("/uploads")}
      />
      {overlay ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
      ) : null}
    </div>
  );
}
