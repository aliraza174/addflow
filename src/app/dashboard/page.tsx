import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/mock-session";

export default async function DashboardRedirectPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const role = session.user.role;
  if (role === "client") redirect("/client/dashboard");
  if (role === "moderator") redirect("/moderator/review-queue");
  redirect("/admin/dashboard");
}

