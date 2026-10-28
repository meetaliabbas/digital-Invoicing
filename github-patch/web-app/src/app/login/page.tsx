import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; message?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/dashboard";
  return <main className="shell"><section className="panel">
    <h1>Welcome back</h1>
    <p className="muted">Sign in to your FBR invoicing workspace.</p>
    {params.message && <p className="notice">{params.message}</p>}
    <AuthForm mode="login" nextPath={next} />
    <div className="links"><Link href="/signup">Create account</Link><Link href="/forgot-password">Forgot password?</Link></div>
  </section></main>;
}
