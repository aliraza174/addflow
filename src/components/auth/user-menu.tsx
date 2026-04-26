"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOutIcon, UserIcon } from "lucide-react";

export function UserMenu({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function logout() {
    try {
      setPending(true);
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      toast.success("Signed out");
      router.push("/");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Logout failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" className="gap-2" disabled={pending} />}
      >
        <UserIcon className="size-4" />
        <span className="max-w-[12rem] truncate">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px]">
        <div className="space-y-1 px-2 py-1.5">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
          <p className="text-xs font-normal text-muted-foreground capitalize">{user.role}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

