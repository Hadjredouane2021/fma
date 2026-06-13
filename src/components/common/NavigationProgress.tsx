"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PageSpinner } from "@/components/common/PageSpinner";
import { useSpinnerLogoUrl } from "@/components/common/SpinnerLogoProvider";

function isInternalNavigation(href: string, pathname: string, search: string): boolean {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
    const target = url.pathname + (url.search || "");
    const current = pathname + (search ? `?${search}` : "");
    return target !== current;
  } catch {
    return false;
  }
}

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [pending, setPending] = useState(false);
  const spinnerImageUrl = useSpinnerLogoUrl();

  useEffect(() => {
    setPending(false);
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !isInternalNavigation(href, pathname, search)) return;
      setPending(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, search]);

  if (!pending) return null;
  return <PageSpinner overlay imageUrl={spinnerImageUrl} />;
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
