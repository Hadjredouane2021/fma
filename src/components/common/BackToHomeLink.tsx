import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

const LABELS: Record<Locale, string> = {
  fr: "Retour à l'accueil",
  en: "Back to home",
  ar: "العودة إلى الصفحة الرئيسية",
};

type BackToHomeLinkProps = {
  locale: Locale;
  className?: string;
};

export function BackToHomeLink({ locale, className }: BackToHomeLinkProps) {
  return (
    <Link
      href={`/${locale}`}
      className={cn(
        "group mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-3)] transition-colors hover:text-primary",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {LABELS[locale]}
    </Link>
  );
}
