import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pencil, Download, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import {
  GALLERY_CATEGORIES,
  GALLERY_CONFIG,
  dbKeyForGallery,
  parseGalleryData,
  type GalleryCategory,
} from "@/lib/galleries";
import DeletePublicationButton from "./_components/DeletePublicationButton";
import PublicationsHeroImagesForm from "./_components/PublicationsHeroImagesForm";
import GalleryAdminForm from "./_components/GalleryAdminForm";
import FolderGalleryForm from "./_components/FolderGalleryForm";
import { isFolderGalleryCategory } from "@/lib/galleries";

const TYPE_LABELS: Record<string, string> = {
  "chiffres-cles":   "Chiffres clés",
  "faits-marquants": "Faits marquants",
  "courrier":        "Le Courrier",
};
const TYPE_COLORS: Record<string, string> = {
  "chiffres-cles": "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/45 dark:text-blue-300 dark:border-blue-800/40",
  "faits-marquants": "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/45 dark:text-purple-300 dark:border-purple-800/40",
  courrier: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/45 dark:text-amber-300 dark:border-amber-800/40",
};

const HERO_KEY = DB_KEYS.PUBLICATIONS_HERO;
type PubType = "chiffres-cles" | "faits-marquants" | "courrier" | GalleryCategory;
const EMPTY_HERO: Record<PubType, string> = {
  "chiffres-cles": "", "faits-marquants": "", courrier: "",
  ...Object.fromEntries(GALLERY_CATEGORIES.map((c) => [c, ""])),
} as Record<PubType, string>;

export default async function AdminPublicationsPage() {
  const [publications, heroRow, galleryRows] = await Promise.all([
    prisma.publication.findMany({
      where: { deletedAt: null },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    }).catch(() => []),
    prisma.setting.findUnique({ where: { key: HERO_KEY } }).catch(() => null),
    prisma.setting.findMany({
      where: { key: { in: GALLERY_CATEGORIES.map((c) => dbKeyForGallery(c)) } },
    }).catch(() => []),
  ]);

  const heroImages: Record<PubType, string> = (() => {
    if (!heroRow) return EMPTY_HERO;
    try { return { ...EMPTY_HERO, ...JSON.parse(heroRow.value) }; }
    catch { return EMPTY_HERO; }
  })();

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
        subtitle={`${publications.length} publication${publications.length !== 1 ? "s" : ""} au total`}
        action={{ label: "Nouvelle publication", href: "/admin/publications/nouveau" }}
      />

      <main className="p-8">
        <PublicationsHeroImagesForm initial={heroImages} />

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
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Titre</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Type</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Année</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {publications.map((pub) => (
                <tr key={pub.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-6 py-4">
                    <p className="max-w-sm truncate font-semibold text-primary transition-colors group-hover:text-gold">{pub.titleFr}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${TYPE_COLORS[pub.type] || "border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text-2)]"}`}
                    >
                      {TYPE_LABELS[pub.type] || pub.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-[var(--text-2)]">{pub.year || <span className="text-[var(--text-3)]">—</span>}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        pub.status === "PUBLISHED"
                          ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                          : "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${pub.status === "PUBLISHED" ? "bg-green-500 dark:bg-green-400" : "bg-amber-400 dark:bg-amber-300"}`} />
                      {pub.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {pub.readMoreUrl && (
                        <a
                          href={pub.readMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-accent"
                          title="Lien « Lire la suite »"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {pub.pdfFile && (
                        <a
                          href={pub.pdfFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/40 dark:hover:text-green-400"
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/publications/${pub.id}`}
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeletePublicationButton id={pub.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {publications.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[var(--text-3)]">
                    <p className="text-4xl mb-3">📄</p>
                    <p className="text-sm">Aucune publication</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
