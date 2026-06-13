import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Users, CheckCircle, Clock } from "lucide-react";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const active = subscribers.filter((s) => s.active).length;
  const pending = subscribers.length - active;

  return (
    <>
      <AdminPageHeader
        title="Newsletter"
        subtitle={`${active} abonné${active !== 1 ? "s" : ""} confirmé${active !== 1 ? "s" : ""}`}
      />

      <main className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total inscrits",
              value: subscribers.length,
              icon: Users,
              bg: "bg-[var(--bg-alt)] border-[var(--border)]",
              icon_c: "text-primary",
              text_c: "text-primary",
            },
            {
              label: "Confirmés",
              value: active,
              icon: CheckCircle,
              bg: "bg-green-50 border-green-100 dark:border-green-900/40 dark:bg-green-950/35",
              icon_c: "text-green-600 dark:text-green-400",
              text_c: "text-green-700 dark:text-green-300",
            },
            {
              label: "En attente",
              value: pending,
              icon: Clock,
              bg: "bg-amber-50 border-amber-100 dark:border-amber-900/40 dark:bg-amber-950/35",
              icon_c: "text-amber-600 dark:text-amber-400",
              text_c: "text-amber-700 dark:text-amber-300",
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`rounded-2xl border p-6 ${s.bg}`}>
                <Icon className={`mb-3 h-5 w-5 ${s.icon_c}`} />
                <div className={`mb-1 text-3xl font-bold ${s.text_c}`}>{s.value}</div>
                <div className="text-sm font-medium text-[var(--text-2)]">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-alt)] px-6 py-4">
            <h2 className="text-sm font-semibold text-primary">Liste des abonnés</h2>
            <a
              href="/api/admin/newsletter/export"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-[var(--bg-alt)]"
            >
              📥 Exporter CSV
            </a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Langue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {subscribers.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-[var(--bg-alt)]/80">
                  <td className="px-6 py-3.5 text-sm font-medium text-primary">{s.email}</td>
                  <td className="px-4 py-3.5 text-sm text-[var(--text-2)]">{s.name || <span className="text-[var(--text-3)]">—</span>}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-[var(--bg-alt)] px-2 py-0.5 font-mono text-xs font-semibold uppercase text-primary">
                      {s.locale}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        s.active
                          ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                          : "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${s.active ? "bg-green-500 dark:bg-green-400" : "bg-amber-400 dark:bg-amber-300"}`} />
                      {s.active ? "Confirmé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[var(--text-3)]">{formatDate(s.createdAt, "fr")}</td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[var(--text-3)]">
                    <p className="text-4xl mb-3">📧</p>
                    <p className="text-sm">Aucun abonné</p>
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
