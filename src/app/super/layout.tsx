import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      title="Super Admin"
      subtitle="System-level control for packages, settings, categories, and platform governance."
    >
      {children}
    </DashboardShell>
  );
}

