import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import DeleteGlossaryTermButton from "./_components/DeleteGlossaryTermButton";
import VocabulaireHeroImageForm from "./_components/VocabulaireHeroImageForm";

export default async function AdminVocabulairePage() {
  const [terms, heroRow] = await Promise.all([
    prisma.glossaryTerm
      .findMany({ orderBy: [{ letter: "asc" }, { order: "asc" }, { termFr: "asc" }] })
      .catch(() => []),
    prisma.setting.findUnique({ where: { key: DB_KEYS.VOCABULAIRE_HERO } }).catch(() => null),
  ]);
  const heroImage = heroRow?.value ?? "";

  return (
    <>
      <AdminPageHeader
        title="Vocabulaire"
        subtitle={`${terms.length} entrée${terms.length !== 1 ? "s" : ""} — page publique Découvrir le secteur / Vocabulaire`}
        action={{ label: "Ajouter un terme", href: "/admin/vocabulaire/nouveau" }}
      />

      <main className="p-8">
        <VocabulaireHeroImageForm initial={heroImage} />
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Lettre</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Terme (FR)</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)] max-w-md">Définition (FR)</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Ordre</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {terms.map((t) => (
                <tr key={t.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-4 py-3">
                    <span className="inline-flex min-w-[2rem] justify-center rounded-lg bg-[var(--bg-alt)] px-2 py-1 text-xs font-bold text-primary">
                      {t.letter.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">{t.termFr}</td>
                  <td className="px-4 py-3 text-[var(--text-2)] max-w-md">
                    <p className="line-clamp-2 text-xs leading-relaxed">{t.definitionFr}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-3)]">{t.order}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/vocabulaire/${t.id}`}
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteGlossaryTermButton id={t.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {terms.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[var(--text-3)]">
                    <p className="mb-2 text-4xl">📖</p>
                    <p className="text-sm">Aucun terme. Ajoutez une entrée pour le glossaire public.</p>
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
