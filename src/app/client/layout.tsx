import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Client" subtitle="Manage your listings, payments, and notifications.">
      {children}
    </DashboardShell>
  );
}

