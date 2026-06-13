"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  GraduationCap,
  Link as LinkIcon,
  BookMarked,
  MessageSquare,
  Mail,
  Phone,
  Settings,
  LogOut,
  Image as ImageIcon,
  UserCog,
  Newspaper,
  ExternalLink,
  Home,
  Landmark,
  PanelBottom,
  Menu,
  UserRound,
  Building2,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonTabActive } from "@/lib/button-styles";

const NAV_GROUPS = [
  {
    label: "Contenu",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Page d'accueil", href: "/admin/page-accueil", icon: Home },
      { label: "La FMA", href: "/admin/la-fma", icon: Landmark },
      { label: "Actualités", href: "/admin/actualites", icon: Newspaper },
      { label: "Publications", href: "/admin/publications", icon: FileText },
      { label: "Conventions", href: "/admin/conventions", icon: BookOpen },
      { label: "Particuliers", href: "/admin/particuliers", icon: UserRound },
      { label: "Entreprises & Pro.", href: "/admin/entreprises", icon: Building2 },
      { label: "Contact", href: "/admin/page-contact", icon: Phone },
      { label: "Chiffres clés", href: "/admin/chiffres-cles", icon: BarChart3 },
    ],
  },
  {
    label: "Organisation",
    items: [
      { label: "Membres FMA", href: "/admin/membres", icon: Users },
      { label: "Équipe", href: "/admin/equipe", icon: UserCog },
      { label: "Formations", href: "/admin/formations", icon: GraduationCap },
      { label: "Liens utiles", href: "/admin/liens-utiles", icon: LinkIcon },
      { label: "Vocabulaire", href: "/admin/vocabulaire", icon: BookMarked },
      { label: "Médias", href: "/admin/medias", icon: ImageIcon },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Messages", href: "/admin/contact", icon: MessageSquare },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    label: "Système",
    items: [
      { label: "Menu de navigation", href: "/admin/menu", icon: Menu },
      { label: "Logo du site", href: "/admin/logo", icon: ImageIcon },
      { label: "Footer", href: "/admin/footer", icon: PanelBottom },
      { label: "Paramètres", href: "/admin/parametres", icon: Settings },
    ],
  },
];

export default function AdminSidebar({ logoUrl }: { logoUrl: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 flex w-64 min-h-screen flex-col border-r border-[var(--sidebar-border,var(--border))] bg-[var(--sidebar,var(--bg-surface))] text-[var(--sidebar-foreground,var(--text-1))] shadow-sm dark:shadow-none">
      <div className="border-b border-[var(--sidebar-border,var(--border))] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 rounded-lg bg-white/90 dark:bg-white/10 px-2 py-1.5 ring-1 ring-[var(--sidebar-border,var(--border))]">
            <Image
              src={logoUrl}
              alt="FMA"
              width={80}
              height={32}
              className="h-7 w-auto object-contain"
              unoptimized={logoUrl.startsWith("/uploads") || logoUrl.endsWith(".svg")}
              priority
            />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] opacity-70 leading-tight">
            Adminis&shy;tration
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {group.label}
            </p>
            {group.items.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "mb-0.5 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? buttonTabActive
                      : "text-[var(--sidebar-foreground,var(--text-2))] hover:bg-[var(--sidebar-accent,var(--hover-bg))] hover:text-[var(--primary)]"
                  )}
                >
                  <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]")} />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-[var(--sidebar-border,var(--border))] px-3 py-4">
        <Link
          href="/fr"
          target="_blank"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--sidebar-foreground,var(--text-2))] transition-colors hover:bg-[var(--sidebar-accent,var(--bg-alt))] hover:text-[var(--primary)]"
        >
          <ExternalLink className="h-4 w-4 text-[var(--muted-foreground)]" />
          Voir le site
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--text-2)] transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
