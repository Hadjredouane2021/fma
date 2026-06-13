import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";
import { DB_KEYS } from "@/lib/db-keys";
import DeleteConventionButton from "./_components/DeleteConventionButton";
import ConventionsHeroImageForm from "./_components/ConventionsHeroImageForm";

export default async function AdminConventionsPage() {
  const [conventions, heroImageRow] = await Promise.all([
    prisma.convention.findMany({ orderBy: [{ order: "asc" }, { signedAt: "desc" }, { titleFr: "asc" }] }).catch(() => []),
    prisma.setting.findUnique({ where: { key: DB_KEYS.CONVENTIONS_HERO } }).catch(() => null),
  ]);
  const heroImage = heroImageRow?.value ?? "";

  return (
    <>
      <AdminPageHeader
        title="Conventions"
        subtitle={`${conventions.length} convention${conventions.length !== 1 ? "s" : ""} — page publique Découvrir le secteur / Conventions (publiées uniquement)`}
        action={{ label: "Ajouter une convention", href: "/admin/conventions/nouveau" }}
      />

      <main className="p-8">
        <ConventionsHeroImageForm initial={heroImage} />
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Titre (FR)</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Slug</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Statut</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">PDF</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Signature</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Ordre</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {conventions.map((c) => (
                <tr key={c.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-4 py-3 font-semibold text-primary max-w-xs">
                    <p className="truncate">{c.titleFr}</p>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-[var(--text-2)]">{c.slug}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        c.status === "PUBLISHED"
                          ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                          : "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300"
                      }`}
                    >
                      {c.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-3)]">{c.pdfFile ? "Oui" : "—"}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-3)]">{c.signedAt ? formatDate(c.signedAt, "fr") : "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-3)]">{c.order}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/conventions/${c.id}`}
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteConventionButton id={c.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {conventions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[var(--text-3)]">
                    <p className="mb-2 text-4xl">📋</p>
                    <p className="text-sm">Aucune convention. Créez-en une pour la page publique.</p>
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
