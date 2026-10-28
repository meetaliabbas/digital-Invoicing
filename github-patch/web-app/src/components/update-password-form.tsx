"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setError(error.message); return; }
    await supabase.auth.signOut({ scope: "local" });
    router.replace("/login?message=Password%20updated.%20Please%20sign%20in.");
    router.refresh();
  }
  return <form onSubmit={submit}>
    <label>New password<input type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
    {error && <p role="alert" className="error">{error}</p>}
    <button disabled={busy}>{busy ? "Updating…" : "Update password"}</button>
  </form>;
}
