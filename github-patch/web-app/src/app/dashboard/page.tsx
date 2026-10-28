import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/signout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect("/login");

  const email = typeof data.claims.email === "string" ? data.claims.email : "Signed-in user";
  return <main className="page">
    <header className="topbar"><div><h1>FBR Digital Invoicing</h1><p className="muted">Secure workspace</p></div><SignOutButton /></header>
    <section className="card"><h2>Authentication foundation is active</h2>
      <p>You are signed in as <strong>{email}</strong>.</p>
      <p className="muted">This is a protected starter dashboard. Existing invoice, buyer, report, and FBR integration screens must be migrated and connected to server-side, tenant-scoped data before production use.</p>
    </section>
  </main>;
}
