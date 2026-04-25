import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function ModeratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      title="Moderator"
      subtitle="Review submitted listings, flag suspicious media, and enforce policy with traceable reasons."
    >
      {children}
    </DashboardShell>
  );
}

