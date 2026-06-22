"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, SignOut } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";

export default function Topbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
  };

  return (
    <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-30">
      <div />
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={() => router.push("/jobs/new")}>
          <Plus weight="bold" className="text-sm" />
          New Job
        </Button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-2.5 py-1.5 rounded-md hover:bg-white/[0.03]"
        >
          <SignOut weight="regular" className="text-base" />
          Sign out
        </button>
      </div>
    </header>
  );
}
