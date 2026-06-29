"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { resolveSiteLogoSources, siteLogoImageUnoptimized } from "@/lib/site-logo";

type SiteLogoVariant = "auto" | "light" | "dark";

type SiteLogoProps = {
  lightSrc: string;
  darkSrc: string;
  alt?: string;
  variant?: SiteLogoVariant;
  className?: string;
  frameClassName?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

export function SiteLogo({
  lightSrc,
  darkSrc,
  alt = "Fédération Marocaine de l'Assurance",
  variant = "auto",
  className,
  frameClassName,
  imageClassName,
  width = 280,
  height = 96,
  sizes = "(max-width: 640px) 152px, (max-width: 1280px) 176px, 240px",
  priority = false,
}: SiteLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const src =
    variant === "light"
      ? lightSrc
      : variant === "dark"
        ? darkSrc
        : mounted && resolvedTheme === "dark"
          ? darkSrc
          : lightSrc;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center",
        frameClassName ?? "max-w-full",
        className
      )}
    >
      <Image
        key={src}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          frameClassName ? "h-full w-full object-contain object-left" : undefined,
          imageClassName
        )}
        sizes={sizes}
        unoptimized={siteLogoImageUnoptimized(src)}
        priority={priority}
      />
    </span>
  );
}

type SiteLogoFromSettingsProps = Omit<SiteLogoProps, "lightSrc" | "darkSrc"> & {
  settings: { imageUrl: string; imageUrlDark: string };
};

export function SiteLogoFromSettings({ settings, ...props }: SiteLogoFromSettingsProps) {
  const { light, dark } = resolveSiteLogoSources(settings);
  return <SiteLogo lightSrc={light} darkSrc={dark} {...props} />;
}
