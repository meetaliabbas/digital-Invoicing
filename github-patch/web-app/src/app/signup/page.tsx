import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return <main className="shell"><section className="panel">
    <h1>Create your account</h1>
    <p className="muted">Use your work email. Email verification may be required by your Supabase Auth settings.</p>
    <AuthForm mode="signup" nextPath="/dashboard" />
    <div className="links"><Link href="/login">Already have an account? Sign in</Link></div>
  </section></main>;
}
