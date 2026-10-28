import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect("/login?message=Open%20the%20password%20reset%20link%20from%20your%20email.");
  return <main className="shell"><section className="panel">
    <h1>Choose a new password</h1><p className="muted">Use at least 8 characters.</p><UpdatePasswordForm />
  </section></main>;
}
