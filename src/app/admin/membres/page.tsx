import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import DeleteMemberButton from "./_components/DeleteMemberButton";

export default async function AdminMembresPage() {
  const members = await prisma.member.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }).catch(() => []);

  return (
    <>
      <AdminPageHeader
        title="Membres FMA"
        subtitle={`${members.length} société${members.length !== 1 ? "s" : ""} — logos sur la page La FMA (12 premiers actifs par ordre)`}
        action={{ label: "Ajouter un membre", href: "/admin/membres/nouveau" }}
      />

      <main className="p-8">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Logo</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Nom (FR)</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Catégorie</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Ordre</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actif</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {members.map((m) => (
                <tr key={m.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-24 overflow-hidden rounded border border-[var(--border)] bg-[var(--bg-alt)]">
                      {m.logo ? (
                        <Image src={m.logo} alt="" fill className="object-contain p-0.5" sizes="96px" unoptimized={m.logo.startsWith("/uploads")} />
                      ) : (
                        <span className="flex h-full items-center justify-center text-[10px] font-medium text-[var(--text-3)] px-1 text-center leading-tight">
                          {m.nameFr.slice(0, 18)}
                          {m.nameFr.length > 18 ? "…" : ""}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">{m.nameFr}</td>
                  <td className="px-4 py-3">
                    {m.category ? (
                      <span className="rounded-lg bg-[var(--bg-alt)] px-2 py-1 text-xs font-medium text-primary">{m.category}</span>
                    ) : (
                      <span className="text-xs text-[var(--text-3)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-3)]">{m.order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        m.active
                          ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                          : "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400"
                      }`}
                    >
                      {m.active ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/membres/${m.id}`}
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteMemberButton id={m.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[var(--text-3)]">
                    <p className="mb-2 text-4xl">🏢</p>
                    <p className="text-sm">Aucune société membre. Ajoutez-en une pour la grille La FMA.</p>
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
