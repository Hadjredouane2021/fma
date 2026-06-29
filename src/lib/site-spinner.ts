export type SiteSpinnerSettings = {
  imageUrl: string;
};

export const DEFAULT_SITE_SPINNER: SiteSpinnerSettings = {
  imageUrl: "/logo-fma-spinner.svg",
};

export function normalizeSiteSpinner(input: unknown): SiteSpinnerSettings {
  if (!input || typeof input !== "object") return DEFAULT_SITE_SPINNER;
  const d = input as Partial<SiteSpinnerSettings>;
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  return {
    imageUrl: str(d.imageUrl, DEFAULT_SITE_SPINNER.imageUrl),
  };
}

export function spinnerImageUnoptimized(url: string): boolean {
  return url.startsWith("/uploads") || /\.svg(\?|#|$)/i.test(url);
}
