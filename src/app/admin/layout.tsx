import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      title="Admin"
      subtitle="Verify payments, schedule publishing, feature ads, and track operations and analytics."
    >
      {children}
    </DashboardShell>
  );
}

