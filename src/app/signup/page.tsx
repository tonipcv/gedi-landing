"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dash.gedi.dev";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    const params = new URLSearchParams({
      email: email.trim(),
      source: "landing_signup",
    });
    window.location.href = `${APP_URL}/signup?${params.toString()}`;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="fixed top-0 z-50 flex h-14 w-full items-center justify-center border-b border-border bg-bg/80 backdrop-blur-xl">
        <a href="/" className="flex items-center gap-2">
          <img src="/future.webp" alt="Gedi" className="h-6 w-6 grayscale" />
          <span className="text-sm font-medium text-grad-light">Gedi</span>
        </a>
      </div>

      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-grad-light">Create your workspace</h1>
          <p className="mt-2 text-sm text-grad-subtle">Start ranking in AI search in under 5 minutes.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="email">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>
          <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50">
            {loading ? "Creating..." : "Start ranking in AI search"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <a
          href={`${APP_URL}/api/auth/google`}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-grad-subtle transition-colors hover:border-muted hover:text-grad-light"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </a>

        <p className="mt-6 text-center text-xs text-muted">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
