"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function Navbar({
  onOpenTutorial,
}: {
  onOpenTutorial?: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between">
      <Link
        href="/dashboard"
        className="text-lg font-bold gradient-text tracking-tight"
      >
        QuizForge
      </Link>

      <div className="flex items-center gap-3">
        {onOpenTutorial && (
          <button
            onClick={onOpenTutorial}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-all cursor-pointer"
            title="How to use"
          >
            ?
          </button>
        )}

        {user && (
          <>
            <span className="text-xs text-[var(--color-text-muted)] hidden sm:inline">
              {user.email}
            </span>
            <button onClick={handleLogout} className="btn-secondary text-xs py-1.5 px-3">
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
