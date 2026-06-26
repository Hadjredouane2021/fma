import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import DeleteUsefulLinkButton from "./_components/DeleteUsefulLinkButton";
import LiensUtilesHeroImageForm from "./_components/LiensUtilesHeroImageForm";

export default async function AdminLiensUtilesPage() {
  const [links, heroRow] = await Promise.all([
    prisma.usefulLink
      .findMany({ orderBy: [{ category: "asc" }, { order: "asc" }, { titleFr: "asc" }] })
      .catch(() => []),
    prisma.setting.findUnique({ where: { key: DB_KEYS.LIENS_UTILES_HERO } }).catch(() => null),
  ]);
  const heroImage = heroRow?.value ?? "";

  return (
    <>
      <AdminPageHeader
        title="Liens utiles"
        subtitle={`${links.length} lien${links.length !== 1 ? "s" : ""} — page publique Découvrir le secteur / Liens utiles (actifs uniquement)`}
        action={{ label: "Ajouter un lien", href: "/admin/liens-utiles/nouveau" }}
      />

      <main className="p-8">
        <LiensUtilesHeroImageForm initial={heroImage} />
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Logo</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Titre (FR)</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)] max-w-xs">URL</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Catégorie</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Ordre</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actif</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {links.map((link) => (
                <tr key={link.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-4 py-3">
                    {link.icon ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-alt)]">
                        <Image
                          src={link.icon}
                          alt=""
                          fill
                          className="object-contain p-0.5"
                          sizes="40px"
                          unoptimized={link.icon.startsWith("/uploads")}
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-3)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">{link.titleFr}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <code className="text-xs text-[var(--text-2)] break-all line-clamp-2">{link.url}</code>
                  </td>
                  <td className="px-4 py-3">
                    {link.category ? (
                      <span className="rounded-lg bg-[var(--bg-alt)] px-2 py-1 text-xs font-medium text-primary capitalize">{link.category}</span>
                    ) : (
                      <span className="text-xs text-[var(--text-3)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-3)]">{link.order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        link.active
                          ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                          : "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400"
                      }`}
                    >
                      {link.active ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/liens-utiles/${link.id}`}
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteUsefulLinkButton id={link.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[var(--text-3)]">
                    <p className="mb-2 text-4xl">🔗</p>
                    <p className="text-sm">Aucun lien. Ajoutez-en pour la page publique.</p>
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
