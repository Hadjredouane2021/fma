"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Calendar, Clock, MapPin, Monitor } from "lucide-react";
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
import { FormationItemIcon } from "@/lib/formations-icons";
import type { FormationItem } from "@/lib/formations-site-public";
import {
  isFormationLucideIcon,
  resolveFormationLink,
} from "@/lib/formations-site-public";
import { isLaFmaIconImage, isLaFmaUploadIcon, normalizeLaFmaIcon } from "@/lib/la-fma-icon";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/types";

type FormationCardProps = {
  formation: FormationItem;
  locale: Locale;
  localePath: string;
};

const LEVEL_COLORS: Record<string, string> = {
  debutant: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
  intermediaire: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  avance: "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
};

function formatLabel(locale: Locale, format: string) {
  if (locale === "ar") {
    if (format === "presentiel") return "حضوري";
    if (format === "distanciel") return "عن بُعد";
    if (format === "hybride") return "مختلط";
    return format;
  }
  if (locale === "en") {
    if (format === "presentiel") return "In person";
    if (format === "distanciel") return "Remote";
    if (format === "hybride") return "Hybrid";
    return format;
  }
  if (format === "presentiel") return "Présentiel";
  if (format === "distanciel") return "Distanciel";
  if (format === "hybride") return "Hybride";
  return format;
}

function learnMoreLabel(locale: Locale) {
  return locale === "ar" ? "اعرف المزيد" : locale === "en" ? "Learn more" : "En savoir plus";
}

function registerLabel(locale: Locale) {
  return locale === "ar" ? "التسجيل" : locale === "en" ? "Register" : "S'inscrire";
}

function closeLabel(locale: Locale) {
  return locale === "ar" ? "إغلاق" : locale === "en" ? "Close" : "Fermer";
}

function ProductIcon({ icon, color }: { icon: string; color: string }) {
  if (isFormationLucideIcon(icon)) {
    return (
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${color} shadow-sm`}
      >
        <FormationItemIcon name={icon} className="h-6 w-6 text-white" />
      </div>
    );
  }
  return <ParticuliersCardIcon icon={icon} color={color} />;
}

export function FormationCard({ formation, locale, localePath }: FormationCardProps) {
  const title = formation.title[locale] || formation.title.fr;
  const desc = formation.description[locale] || formation.description.fr;
  const feats = formation.features.map((f) => f[locale] || f.fr).filter(Boolean);
  const detailHtml = (formation.detailContent?.[locale] || formation.detailContent?.fr || "").trim();
  const hasModal = detailHtml.length > 0;
  const registrationUrl = formation.registrationUrl?.trim() || "";
  const learnMoreHref = resolveFormationLink(formation.link, localePath);
  const isExternalLink = /^https?:\/\//i.test(learnMoreHref);
  const iconValue = normalizeLaFmaIcon(formation.icon);
  const [coverFailed, setCoverFailed] = useState(false);
  const hasCoverImage = Boolean(iconValue) && !coverFailed && isLaFmaIconImage(iconValue);

  const actionLabel = registrationUrl ? registerLabel(locale) : learnMoreLabel(locale);
  const actionHref = registrationUrl || learnMoreHref;
  const actionIsExternal = registrationUrl ? true : isExternalLink;

  const actionButton = (
    <Button variant="outline" shape="rounded" size="sm" className="gap-2">
      {actionLabel}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );

  const actionControl = hasModal && !registrationUrl ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" shape="rounded" size="sm" className="relative z-10 gap-2">
          {learnMoreLabel(locale)}
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
  ) : actionIsExternal ? (
    <a
      href={actionHref}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 inline-flex"
    >
      {actionButton}
    </a>
  ) : (
    <Link href={actionHref} className="relative z-10 inline-flex">
      {actionButton}
    </Link>
  );

  const meta = (
    <div className="relative z-10 mb-4 flex flex-wrap gap-3">
      {formation.startDate ? (
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)]">
          <Calendar className="h-3.5 w-3.5 text-gold" />
          {formatDate(formation.startDate, locale)}
        </span>
      ) : null}
      {formation.location ? (
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)]">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          {formation.location}
        </span>
      ) : null}
      {formation.duration ? (
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)]">
          <Clock className="h-3.5 w-3.5 text-gold" />
          {formation.duration}
        </span>
      ) : null}
      {formation.format ? (
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-2)]">
          {formation.format === "distanciel" ? (
            <Monitor className="h-3.5 w-3.5 text-gold" />
          ) : (
            <Building2 className="h-3.5 w-3.5 text-gold" />
          )}
          {formatLabel(locale, formation.format)}
        </span>
      ) : null}
      {formation.organizer ? (
        <span className="text-xs text-[var(--text-3)]">{formation.organizer}</span>
      ) : null}
      {formation.price ? (
        <span className="text-xs font-semibold text-primary">{formation.price}</span>
      ) : null}
    </div>
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
        <div className="relative z-10 p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-primary leading-snug">{title}</h2>
            {formation.level ? (
              <span
                className={`ml-2 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${LEVEL_COLORS[formation.level] || "bg-[var(--bg-alt)] text-[var(--text-2)]"}`}
              >
                {formation.level}
              </span>
            ) : null}
          </div>
          {meta}
          {actionControl}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-liquid rounded-2xl p-7 card-hover">
      <div className="relative z-10 flex items-start gap-5">
        <ProductIcon icon={formation.icon} color={formation.color} />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-primary leading-snug">{title}</h2>
            {formation.level ? (
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${LEVEL_COLORS[formation.level] || "bg-[var(--bg-alt)] text-[var(--text-2)]"}`}
              >
                {formation.level}
              </span>
            ) : null}
          </div>
          {desc ? (
            <div className="prose-fma mb-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
          ) : null}
          {meta}
          {feats.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {feats.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <div className="relative z-10 mt-5">{actionControl}</div>
        </div>
      </div>
    </div>
  );
}
