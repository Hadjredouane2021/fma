import type { Locale } from "@/types";

type LocaleFlagProps = {
  locale: Locale;
  className?: string;
};

export function LocaleFlag({ locale, className }: LocaleFlagProps) {
  if (locale === "fr") {
    return (
      <svg viewBox="0 0 3 2" className={className} aria-hidden>
        <rect width="1" height="2" fill="#002395" />
        <rect x="1" width="1" height="2" fill="#fff" />
        <rect x="2" width="1" height="2" fill="#ed2939" />
      </svg>
    );
  }

  if (locale === "ar") {
    return (
      <svg viewBox="0 0 900 600" className={className} aria-hidden>
        <rect width="900" height="600" fill="#c1272d" />
        <polygon
          fill="none"
          stroke="#006233"
          strokeWidth="28"
          strokeLinejoin="miter"
          points="450,168 509.3,350.5 357.3,237.6 542.7,237.6 390.7,350.5"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="10" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="6" />
      <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="16" />
      <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="10" />
    </svg>
  );
}
