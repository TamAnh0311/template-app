import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

export const metadata: Metadata = {
  title: "Sign In",
};

/**
 * Login page — email/password form with social OAuth options.
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-app-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-10 h-10 rounded-xl bg-app-accent mx-auto" />
          </Link>
          <h1 className="text-2xl font-display font-semibold text-app-text">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-app-text-secondary">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-app-card border border-app-border rounded-2xl p-6 shadow-card space-y-5">
          {/* Social */}
          <SocialLoginButtons />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-app-border" />
            <span className="text-xs text-app-text-muted">or</span>
            <div className="flex-1 h-px bg-app-border" />
          </div>

          {/* Email form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-app-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-app-accent hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
