import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import {
  GALLERY_CATEGORIES,
  GALLERY_CONFIG,
  dbKeyForGallery,
  parseGalleryData,
} from "@/lib/galleries";
import { PublicationsAdminTable } from "./_components/PublicationsAdminTable";
import { PublicationsTypeFilter } from "./_components/PublicationsTypeFilter";
import PublicationsHeroImagesForm from "./_components/PublicationsHeroImagesForm";
import GalleryAdminForm from "./_components/GalleryAdminForm";
import FolderGalleryForm from "./_components/FolderGalleryForm";
import { isFolderGalleryCategory } from "@/lib/galleries";
import { parsePublicationsHeroImagesFromSetting } from "@/lib/publications-hero-images";

const TYPE_LABELS: Record<string, string> = {
  "chiffres-cles":   "Chiffres clés",
  "faits-marquants": "Faits marquants",
  "courrier":        "Le Courrier",
};

const HERO_KEY = DB_KEYS.PUBLICATIONS_HERO;
export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: typeFilter } = await searchParams;
  const typeFilterOptions = Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }));
  const validType =
    typeFilter && typeFilterOptions.some((o) => o.value === typeFilter) ? typeFilter : undefined;

  const [publications, typeCounts, heroRow, galleryRows] = await Promise.all([
    prisma.publication.findMany({
      where: {
        deletedAt: null,
        ...(validType ? { type: validType } : {}),
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    }).catch(() => []),
    prisma.publication.groupBy({
      by: ["type"],
      where: { deletedAt: null },
      _count: { _all: true },
    }).catch(() => []),
    prisma.setting.findUnique({ where: { key: HERO_KEY } }).catch(() => null),
    prisma.setting.findMany({
      where: { key: { in: GALLERY_CATEGORIES.map((c) => dbKeyForGallery(c)) } },
    }).catch(() => []),
  ]);

  const countByType = new Map<string, number>(
    typeCounts.map(({ type, _count }) => [type, _count._all] as [string, number])
  );
  const totalPublicationCount = typeCounts.reduce((sum, { _count }) => sum + _count._all, 0);
  const typeFilterOptionsWithCounts = typeFilterOptions.map((opt) => ({
    ...opt,
    count: countByType.get(opt.value) ?? 0,
  }));

  const heroImages = parsePublicationsHeroImagesFromSetting(heroRow?.value);

  const galleryRowMap = new Map<string, string>(galleryRows.map((row) => [row.key, row.value] as [string, string]));
  const galleries = GALLERY_CATEGORIES.map((category) => ({
    category,
    label: GALLERY_CONFIG[category].title.fr,
    uploadFolder: GALLERY_CONFIG[category].uploadFolder,
    data: parseGalleryData(galleryRowMap.get(dbKeyForGallery(category)), category),
  }));

  return (
    <>
      <AdminPageHeader
        title="Publications"
        subtitle={
          validType
            ? `${publications.length} publication${publications.length !== 1 ? "s" : ""} — ${TYPE_LABELS[validType] || validType}`
            : `${publications.length} publication${publications.length !== 1 ? "s" : ""} au total`
        }
        action={{ label: "Nouvelle publication", href: "/admin/publications/nouveau" }}
      />

      <main className="p-8">
        <PublicationsHeroImagesForm initial={heroImages} />

        <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3 sm:px-6">
            <Suspense fallback={null}>
              <PublicationsTypeFilter
                options={typeFilterOptionsWithCounts}
                totalCount={totalPublicationCount}
              />
            </Suspense>
            {validType ? (
              <Link
                href="/admin/publications"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Réinitialiser le filtre
              </Link>
            ) : null}
          </div>
          <PublicationsAdminTable
            publications={publications}
            emptyMessage={validType ? "Aucune publication pour ce type" : "Aucune publication"}
          />
        </div>

        {galleries.map((g) =>
          isFolderGalleryCategory(g.category) ? (
            <FolderGalleryForm
              key={g.category}
              category={g.category}
              label={g.label}
              uploadFolder={g.uploadFolder}
              initialTitle={g.data.title}
              initialFolders={g.data.folders ?? []}
            />
          ) : (
            <GalleryAdminForm
              key={g.category}
              category={g.category}
              uploadFolder={g.uploadFolder}
              label={g.label}
              initial={g.data.items}
              initialTitle={g.data.title}
            />
          )
        )}
      </main>
    </>
  );
}
