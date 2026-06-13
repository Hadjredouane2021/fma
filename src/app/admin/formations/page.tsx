import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";
import { DB_KEYS } from "@/lib/db-keys";
import DeleteFormationButton from "./_components/DeleteFormationButton";
import FormationsHeroImageForm from "./_components/FormationsHeroImageForm";

export default async function AdminFormationsPage() {
  const [formations, heroImageRow] = await Promise.all([
    prisma.formation.findMany({ orderBy: [{ startDate: "desc" }, { titleFr: "asc" }] }).catch(() => []),
    prisma.setting.findUnique({ where: { key: DB_KEYS.FORMATIONS_HERO } }).catch(() => null),
  ]);
  const heroImage = heroImageRow?.value ?? "";

  const formatMap: Record<string, string> = { presentiel: "Présentiel", distanciel: "Distanciel", hybride: "Hybride" };

  return (
    <>
      <AdminPageHeader
        title="Formations"
        subtitle={`${formations.length} formation${formations.length !== 1 ? "s" : ""} — page publique Découvrir le secteur / Formations (publiées uniquement)`}
        action={{ label: "Ajouter une formation", href: "/admin/formations/nouveau" }}
      />
      <main className="p-8">
        <FormationsHeroImageForm initial={heroImage} />
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Titre (FR)</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Statut</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Format</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Niveau</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Date début</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Lieu</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {formations.map((f) => (
                <tr key={f.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-4 py-3 font-semibold text-primary max-w-xs">
                    <p className="truncate">{f.titleFr}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                      f.status === "PUBLISHED"
                        ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                        : "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300"
                    }`}>
                      {f.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-2)]">{f.format ? formatMap[f.format] || f.format : "—"}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-2)]">{f.level || "—"}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-3)]">{f.startDate ? formatDate(f.startDate, "fr") : "—"}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-3)]">{f.location || "—"}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/formations/${f.id}`} className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary" title="Modifier">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteFormationButton id={f.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {formations.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[var(--text-3)]">
                    <p className="mb-2 text-4xl">🎓</p>
                    <p className="text-sm">Aucune formation. Créez-en une pour la page publique.</p>
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
