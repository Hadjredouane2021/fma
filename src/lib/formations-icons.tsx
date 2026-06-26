import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Globe,
  GraduationCap,
  Monitor,
  Presentation,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { FormationIconName } from "@/lib/formations-site-public";

const ICON_MAP: Record<FormationIconName, LucideIcon> = {
  GraduationCap,
  BookOpen,
  Presentation,
  Users,
  Award,
  Calendar,
  Monitor,
  Building2,
  Globe,
  Briefcase,
};

export function FormationItemIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name as FormationIconName] ?? GraduationCap;
  return <Icon className={className} />;
}
