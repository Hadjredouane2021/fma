export function normalizeLaFmaIcon(icon: string): string {
  const v = icon.trim();
  if (!v) return v;

  if (v.startsWith("/uploads/")) return v;

  if (v.startsWith("http://") || v.startsWith("https://")) {
    try {
      const { pathname } = new URL(v);
      if (pathname.startsWith("/uploads/")) return pathname;
    } catch {
      /* ignore invalid URL */
    }
  }

  return v;
}

export function isLaFmaIconImage(icon: string): boolean {
  const v = normalizeLaFmaIcon(icon);
  return v.startsWith("/uploads/") || v.startsWith("http://") || v.startsWith("https://");
}

export function isLaFmaUploadIcon(icon: string): boolean {
  return normalizeLaFmaIcon(icon).startsWith("/uploads/");
}
