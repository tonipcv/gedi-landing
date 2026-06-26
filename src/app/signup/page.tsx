"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Lock, Mail, User } from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dash.gedi.dev";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password"));
    const websiteUrl = String(form.get("websiteUrl") || "").trim();
    const name = String(form.get("name") || "").trim();
    if (!email.includes("@") || password.length < 8) return;
    setLoading(true);

    try {
      const res = await fetch(`${APP_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, websiteUrl, source: "landing" }),
      });
      if (res.ok) {
        window.location.href = "/onboarding";
        return;
      }
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Signup failed. Please try again.");
    } catch {
      window.location.href = "/onboarding";
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-1/2 items-center justify-center border-r border-border bg-surface p-12 lg:flex">
        <div className="max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <img src="/future.webp" alt="Gedi" className="h-10 w-10" />
            <div>
              <p className="text-lg font-medium text-grad-light">Gedi</p>
              <p className="text-xs text-muted">AI SEO Co-Pilot</p>
            </div>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Create workspace</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-grad-light">Set up a project and content calendar.</h1>
          <p className="mt-4 text-sm leading-6 text-grad-subtle">The app stores workspace settings, generated drafts and integration configuration.</p>
          <div className="mt-8 rounded-xl border border-border bg-bg p-5">
            <p className="text-sm font-medium text-grad-light">After signup</p>
            <ul className="mt-3 space-y-2 text-sm text-grad-subtle">
              <li>Add website details</li>
              <li>Review competitor domains</li>
              <li>Open the dashboard setup screen</li>
            </ul>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center p-5">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <img src="/future.webp" alt="Gedi" className="h-8 w-8" />
            <span className="text-base font-medium text-grad-light">Gedi</span>
          </div>
          <h2 className="text-[26px] font-semibold leading-tight text-grad-light">Create account</h2>
          <p className="mb-6 mt-2 text-sm text-grad-subtle">Start with your website and finish onboarding.</p>

          <a
            href={`${APP_URL}/api/auth/google`}
            className="mb-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-grad-subtle transition-colors hover:border-muted hover:text-grad-light"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </a>

          <div className="mb-5 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="name">Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input id="name" name="name" className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" required />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="email">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input id="email" name="email" type="email" className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" required />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input id="password" name="password" type="password" className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" required minLength={8} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="websiteUrl">Website URL</label>
              <div className="relative">
                <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input id="websiteUrl" name="websiteUrl" className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" required />
              </div>
            </div>
            <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50">
              {loading ? "Creating..." : "Create workspace"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            Already have an account?{" "}
            <Link href={`${APP_URL}/login`} className="font-medium text-grad-subtle hover:text-grad-light hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
