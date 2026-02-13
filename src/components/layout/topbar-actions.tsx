"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function TopbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="rounded-lg" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="h-4 w-4 text-neutral-400" />
        Logout
      </Button>
    </div>
  );
}
