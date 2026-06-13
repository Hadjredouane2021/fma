import {
  Briefcase,
  Building2,
  Factory,
  Globe,
  HeartPulse,
  Landmark,
  Shield,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { EntrepriseIconName } from "@/lib/entreprises-site-public";

const ICON_MAP: Record<EntrepriseIconName, LucideIcon> = {
  Building2,
  Truck,
  Users,
  Globe,
  Factory,
  Briefcase,
  Shield,
  Landmark,
  HeartPulse,
  Wallet,
};

export function EntrepriseProductIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name as EntrepriseIconName] ?? Building2;
  return <Icon className={className} />;
}
