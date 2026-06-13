import { prisma } from "@/lib/prisma";
import { Newspaper, FileText, MessageSquare, Mail, Users, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

async function getStats() {
  const [posts, publications, messages, subscribers, members, formations] = await Promise.all([
    prisma.post.count({ where: { deletedAt: null } }),
    prisma.publication.count({ where: { deletedAt: null } }),
    prisma.contactMessage.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.member.count({ where: { active: true } }),
    prisma.formation.count(),
  ]).catch(() => [0, 0, 0, 0, 0, 0]);
  return { posts, publications, messages, subscribers, members, formations };
}

async function getRecentMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 6 }).catch(() => []);
}

export default async function DashboardPage() {
  const [stats, messages] = await Promise.all([getStats(), getRecentMessages()]);

  const STATS = [
    { label: "Actualités", value: stats.posts, icon: Newspaper, href: "/admin/actualites", bg: "bg-blue-50 dark:bg-blue-950/40", icon_color: "text-blue-600 dark:text-blue-300", border: "border-blue-100 dark:border-blue-900/35" },
    { label: "Publications", value: stats.publications, icon: FileText, href: "/admin/publications", bg: "bg-purple-50 dark:bg-purple-950/40", icon_color: "text-purple-600 dark:text-purple-300", border: "border-purple-100 dark:border-purple-900/35" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, href: "/admin/contact", bg: "bg-orange-50 dark:bg-orange-950/40", icon_color: "text-orange-600 dark:text-orange-300", border: "border-orange-100 dark:border-orange-900/35" },
    { label: "Newsletter", value: stats.subscribers, icon: Mail, href: "/admin/newsletter", bg: "bg-green-50 dark:bg-green-950/40", icon_color: "text-green-600 dark:text-green-300", border: "border-green-100 dark:border-green-900/35" },
    { label: "Membres", value: stats.members, icon: Users, href: "/admin/membres", bg: "bg-[var(--bg-alt)] dark:bg-primary/15", icon_color: "text-primary", border: "border-[var(--border)]" },
    { label: "Formations", value: stats.formations, icon: BookOpen, href: "/admin/formations", bg: "bg-cyan-50 dark:bg-cyan-950/40", icon_color: "text-cyan-600 dark:text-cyan-300", border: "border-cyan-100 dark:border-cyan-900/35" },
  ];

  const QUICK_ACTIONS = [
    { label: "Page La FMA", href: "/admin/la-fma", emoji: "🏛️" },
    { label: "Nouvelle actualité",    href: "/admin/actualites/nouveau", emoji: "📰" },
    { label: "Nouvelle publication",  href: "/admin/publications/nouveau", emoji: "📄" },
    { label: "Ajouter un membre",     href: "/admin/membres/nouveau", emoji: "🏢" },
    { label: "Ajouter une formation", href: "/admin/formations/nouveau", emoji: "🎓" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Bienvenue dans votre espace d'administration FMA"
      />

      <main className="p-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map(({ label, value, icon: Icon, href, bg, icon_color, border }) => (
            <Link key={label} href={href} className={`glass-liquid rounded-2xl ${border} p-5 group card-hover`}>
              <div className={`relative z-10 w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${icon_color}`} />
              </div>
              <div className="relative z-10 text-2xl font-bold text-primary">{typeof value === "number" ? value.toLocaleString() : 0}</div>
              <div className="relative z-10 mt-0.5 text-xs font-medium text-[var(--text-3)]">{label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent messages */}
          <div className="lg:col-span-2 overflow-hidden glass-liquid rounded-2xl card-hover">
            <div className="relative z-10 flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div>
                <h2 className="text-sm font-bold text-primary">Messages récents</h2>
                <p className="mt-0.5 text-xs text-[var(--text-3)]">Derniers messages du formulaire de contact</p>
              </div>
              <Link href="/admin/contact" className="flex items-center gap-1 text-xs text-primary font-semibold hover:gap-2 transition-all">
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="relative z-10 divide-y divide-[var(--border)]">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-[var(--text-3)]">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucun message</p>
                </div>
              ) : messages.map((m) => (
                <div key={m.id} className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[var(--bg-alt)]/80">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg-alt)] text-sm font-bold text-primary">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text-1)]">{m.name}</p>
                    <p className="truncate text-xs text-[var(--text-3)]">{m.subject}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span className="text-xs text-[var(--text-3)]">{new Date(m.createdAt).toLocaleDateString("fr-FR")}</span>
                    {m.status === "unread" && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions + mini stats */}
          <div className="space-y-5">
            <div className="glass-liquid rounded-2xl p-5 card-hover">
              <h2 className="relative z-10 mb-4 text-sm font-bold text-primary">Actions rapides</h2>
              <div className="relative z-10 space-y-2">
                {QUICK_ACTIONS.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="group flex items-center gap-3 rounded-xl glass-panel p-3 text-sm font-medium text-[var(--text-2)] transition-all hover:border-primary/20"
                  >
                    <span className="text-lg">{a.emoji}</span>
                    <span className="transition-colors group-hover:text-primary">{a.label}</span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-[var(--text-3)] transition-colors group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-primary rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wide">Résumé</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Articles publiés</span>
                  <span className="font-bold text-white">{typeof stats.posts === "number" ? stats.posts : 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Abonnés actifs</span>
                  <span className="font-bold text-gold">{typeof stats.subscribers === "number" ? stats.subscribers : 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Messages non lus</span>
                  <span className="font-bold text-white">{messages.filter(m => m.status === "unread").length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
