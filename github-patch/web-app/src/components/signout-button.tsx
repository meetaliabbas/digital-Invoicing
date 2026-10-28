"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    setBusy(false);
    if (error) return;
    router.replace("/login");
    router.refresh();
  }
  return <button onClick={signOut} disabled={busy}>{busy ? "Signing out…" : "Sign out"}</button>;
}
