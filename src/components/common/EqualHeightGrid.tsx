"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type EqualHeightGridProps = {
  className?: string;
  children: ReactNode;
};

export function EqualHeightGrid({ className, children }: EqualHeightGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const getItems = () => Array.from(root.querySelectorAll<HTMLElement>("[data-equal-height-item]"));

    const sync = () => {
      const items = getItems();
      items.forEach((item) => {
        item.style.minHeight = "";
      });
      const maxHeight = items.reduce((max, item) => {
        const cssMin = parseFloat(getComputedStyle(item).minHeight) || 0;
        return Math.max(max, item.offsetHeight, cssMin);
      }, 0);
      if (maxHeight <= 0) return;
      items.forEach((item) => {
        item.style.minHeight = `${maxHeight}px`;
      });
    };

    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(root);
    getItems().forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [children]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
