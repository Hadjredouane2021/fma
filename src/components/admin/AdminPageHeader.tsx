import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}

export function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-surface)] px-8 py-5">
      <div>
        <h1 className="text-xl font-bold text-primary">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-[var(--text-3)]">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href}>
          <Button variant="primary" shape="rounded" size="md">
            <Plus className="w-4 h-4" />
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
