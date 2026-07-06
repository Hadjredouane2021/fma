import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pencil, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import { parseActualitesHeroImageUrlsFromSetting } from "@/lib/actualites-hero-image";
import DeleteButton from "./_components/DeleteButton";
import ActualitesHeroImageForm from "./_components/ActualitesHeroImageForm";

export default async function AdminActualitesPage() {
  const [posts, heroRow] = await Promise.all([
    prisma.post.findMany({
      where: { deletedAt: null },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.setting.findUnique({ where: { key: DB_KEYS.ACTUALITES_HERO } }).catch(() => null),
  ]);
  const heroImages = parseActualitesHeroImageUrlsFromSetting(heroRow?.value);

  return (
    <>
      <AdminPageHeader
        title="Actualités"
        subtitle={`${posts.length} article${posts.length !== 1 ? "s" : ""} au total`}
        action={{ label: "Nouvelle actualité", href: "/admin/actualites/nouveau" }}
      />

      <main className="p-8">
        <ActualitesHeroImageForm initial={heroImages} />
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Titre</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Catégorie</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Statut</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.map((post) => (
                <tr key={post.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-6 py-4">
                    <p className="max-w-xs truncate font-semibold text-primary transition-colors group-hover:text-gold">{post.titleFr}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs text-[var(--text-3)]">/{post.slug}</p>
                      {post.announcePopup && post.status === "PUBLISHED" ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                          Popup
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {post.category ? (
                      <span className="rounded-lg bg-[var(--bg-alt)] px-2.5 py-1 text-xs font-medium text-primary">
                        {post.category.nameFr}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--text-3)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        post.status === "PUBLISHED"
                          ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                          : "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${post.status === "PUBLISHED" ? "bg-green-500 dark:bg-green-400" : "bg-amber-400 dark:bg-amber-300"}`} />
                      {post.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-[var(--text-3)]">{formatDate(post.createdAt, "fr")}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/fr/actualites/${post.slug}`}
                        target="_blank"
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/actualites/${post.id}`}
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[var(--text-3)]">
                    <p className="text-4xl mb-3">📰</p>
                    <p className="text-sm">Aucune actualité</p>
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
