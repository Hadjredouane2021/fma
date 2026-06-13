import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cn } from "@/lib/utils";
import { buttonBase, buttonPrimary, buttonSizes } from "@/lib/button-styles";
import MarkReadButton from "./_components/MarkReadButton";
import { Mail, Phone, Calendar } from "lucide-react";

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const unread = messages.filter((m) => m.status === "unread").length;

  return (
    <>
      <AdminPageHeader
        title="Messages de contact"
        subtitle={unread > 0 ? `${unread} message${unread > 1 ? "s" : ""} non lu${unread > 1 ? "s" : ""}` : "Tous les messages lus"}
      />

      <main className="p-8">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: messages.length, color: "text-primary", bg: "bg-[var(--bg-alt)] border-[var(--border)]" },
            { label: "Non lus", value: unread, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 border-blue-100 dark:border-blue-900/40 dark:bg-blue-950/35" },
            { label: "Lus", value: messages.length - unread, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 border-green-100 dark:border-green-900/40 dark:bg-green-950/35" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
              <div className={`mb-1 text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm font-medium text-[var(--text-2)]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-16 text-center">
              <Mail className="mx-auto mb-3 h-10 w-10 text-[var(--text-3)] opacity-60" />
              <p className="text-sm text-[var(--text-3)]">Aucun message reçu</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl border bg-[var(--bg-surface)] p-6 shadow-sm transition-all dark:shadow-none ${
                  m.status === "unread"
                    ? "border-blue-200 ring-1 ring-blue-100 dark:border-blue-700/60 dark:ring-blue-900/50"
                    : "border-[var(--border)]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg-alt)] text-base font-bold text-primary">
                      {m.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-primary">{m.name}</span>
                        {m.status === "unread" && (
                          <span className="rounded-full bg-blue-500 dark:bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">Nouveau</span>
                        )}
                      </div>

                      <div className="mb-3 flex flex-wrap gap-4 text-xs text-[var(--text-3)]">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-gold" />{m.email}
                      </span>
                      {m.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-gold" />{m.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gold" />{formatDate(m.createdAt, "fr")}
                      </span>
                    </div>

                    {/* Subject + message */}
                    <p className="mb-2 text-sm font-semibold text-primary">{m.subject}</p>
                    <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-2)]">{m.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 flex-col gap-2">
                  <a
                    href={`mailto:${m.email}?subject=Re: ${m.subject}`}
                    className={cn(buttonBase, buttonPrimary, buttonSizes.rounded.sm, "text-xs text-center")}
                  >
                    Répondre
                  </a>
                  {m.status === "unread" && <MarkReadButton id={m.id} />}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
