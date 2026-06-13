"use client";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { NavigationProgress } from "@/components/common/NavigationProgress";
import { SpinnerLogoProvider } from "@/components/common/SpinnerLogoProvider";

export default function AdminShell({
  children,
  spinnerImageUrl,
  logoUrl,
}: {
  children: React.ReactNode;
  spinnerImageUrl: string;
  logoUrl: string;
}) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <SpinnerLogoProvider imageUrl={spinnerImageUrl}>
      <NavigationProgress />
      <div className="admin-theme flex min-h-screen bg-[var(--bg-alt)] text-[var(--text-1)] dark:bg-[var(--bg)]">
        <AdminSidebar logoUrl={logoUrl} />
        <div className="ml-64 flex min-h-screen flex-1 flex-col bg-[var(--bg)]">{children}</div>
      </div>
    </SpinnerLogoProvider>
  );
}
