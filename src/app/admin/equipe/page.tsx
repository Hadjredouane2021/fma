import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import DeleteTeamMemberButton from "./_components/DeleteTeamMemberButton";

export default async function AdminEquipePage() {
  const team = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }).catch(() => []);

  return (
    <>
      <AdminPageHeader
        title="Équipe"
        subtitle={`${team.length} membre${team.length !== 1 ? "s" : ""} — sur le site, la section Direction de La FMA n’affiche que les 2 premiers (service « direction », tri par ordre, actifs).`}
        action={{ label: "Ajouter un membre", href: "/admin/equipe/nouveau" }}
      />

      <main className="p-8">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Photo</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Nom (FR)</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Fonction</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Service</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Ordre</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actif</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {team.map((m) => (
                <tr key={m.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-4 py-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-alt)]">
                      {m.photo ? (
                        <Image src={m.photo} alt="" fill className="object-cover" sizes="44px" unoptimized={m.photo.startsWith("/uploads")} />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs font-bold text-primary/40">
                          {m.nameFr.charAt(0)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">{m.nameFr}</td>
                  <td className="px-4 py-3 text-[var(--text-2)]">{m.titleFr || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-[var(--bg-alt)] px-2 py-1 text-xs font-medium text-primary">{m.department || "—"}</span>
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
                        href={`/admin/equipe/${m.id}`}
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteTeamMemberButton id={m.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {team.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[var(--text-3)]">
                    <p className="mb-2 text-4xl">👤</p>
                    <p className="text-sm">Aucun membre. Ajoutez-en un pour la page La FMA.</p>
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
