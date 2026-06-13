"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ParticuliersCardIcon } from "@/components/common/ParticuliersCardIcon";
import { EntrepriseProductIcon } from "@/lib/entreprises-icons";
import type { EntrepriseProduct } from "@/lib/entreprises-site-public";
import {
  isEntrepriseLucideIcon,
  resolveEntrepriseProductLink,
} from "@/lib/entreprises-site-public";
import { isLaFmaIconImage, isLaFmaUploadIcon, normalizeLaFmaIcon } from "@/lib/la-fma-icon";
import type { Locale } from "@/types";

type EntreprisesProductCardProps = {
  product: EntrepriseProduct;
  locale: Locale;
  localePath: string;
};

function learnMoreLabel(locale: Locale) {
  return locale === "ar" ? "اعرف المزيد" : locale === "en" ? "Learn more" : "En savoir plus";
}

function closeLabel(locale: Locale) {
  return locale === "ar" ? "إغلاق" : locale === "en" ? "Close" : "Fermer";
}

function ProductIcon({ icon, color }: { icon: string; color: string }) {
  if (isEntrepriseLucideIcon(icon)) {
    return (
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${color} shadow-sm`}
      >
        <EntrepriseProductIcon name={icon} className="h-6 w-6 text-white" />
      </div>
    );
  }
  return <ParticuliersCardIcon icon={icon} color={color} />;
}

export function EntreprisesProductCard({ product, locale, localePath }: EntreprisesProductCardProps) {
  const title = product.title[locale] || product.title.fr;
  const desc = product.description[locale] || product.description.fr;
  const feats = product.features.map((f) => f[locale] || f.fr).filter(Boolean);
  const detailHtml = (product.detailContent?.[locale] || product.detailContent?.fr || "").trim();
  const hasModal = detailHtml.length > 0;
  const learnMoreHref = resolveEntrepriseProductLink(product.link, localePath);
  const isExternalLink = /^https?:\/\//i.test(learnMoreHref);
  const buttonLabel = learnMoreLabel(locale);
  const iconValue = normalizeLaFmaIcon(product.icon);
  const [coverFailed, setCoverFailed] = useState(false);
  const hasCoverImage = Boolean(iconValue) && !coverFailed && isLaFmaIconImage(iconValue);

  const learnMoreButton = (
    <Button variant="outline" shape="rounded" size="sm" className="gap-2">
      {buttonLabel}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );

  const learnMoreControl = hasModal ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" shape="rounded" size="sm" className="relative z-10 gap-2">
          {buttonLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="left-1/2 top-1/2 max-h-[90vh] w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 sm:max-w-3xl">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="prose-fma max-h-[calc(90vh-7rem)] overflow-y-auto px-5 py-4 text-sm leading-relaxed sm:px-6">
          <div dangerouslySetInnerHTML={{ __html: detailHtml }} />
        </div>
        <div className="border-t border-[var(--border)] px-5 py-4 sm:px-6">
          <DialogClose asChild>
            <Button variant="primary" shape="rounded" size="sm">
              {closeLabel(locale)}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ) : isExternalLink ? (
    <a
      href={learnMoreHref}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 inline-flex"
    >
      {learnMoreButton}
    </a>
  ) : (
    <Link href={learnMoreHref} className="relative z-10 inline-flex">
      {learnMoreButton}
    </Link>
  );

  if (hasCoverImage) {
    return (
      <div className="glass-liquid card-hover overflow-hidden rounded-2xl p-0">
        <div className="relative min-h-[10.125rem] w-full">
          <Image
            src={iconValue}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={isLaFmaUploadIcon(iconValue)}
            onError={() => setCoverFailed(true)}
            priority={false}
          />
        </div>
        <div className="relative z-10 p-5">{learnMoreControl}</div>
      </div>
    );
  }

  return (
    <div className="glass-liquid rounded-2xl p-7 card-hover">
      <div className="relative z-10 flex items-start gap-5">
        <ProductIcon icon={product.icon} color={product.color} />
        <div className="flex-1">
          <h2 className="mb-2 text-lg font-bold text-primary">{title}</h2>
          <div className="prose-fma mb-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
          {feats.length > 0 && (
            <ul className="space-y-1.5">
              {feats.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <div className="relative z-10 mt-5">{learnMoreControl}</div>
        </div>
      </div>
    </div>
  );
}
