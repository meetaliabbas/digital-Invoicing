import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function ForgotPasswordPage() {
  return <main className="shell"><section className="panel">
    <h1>Reset your password</h1>
    <p className="muted">We’ll email you a secure password-reset link if the account exists.</p>
    <AuthForm mode="reset" nextPath="/auth/callback?next=/update-password" />
    <div className="links"><Link href="/login">Back to sign in</Link></div>
  </section></main>;
}
