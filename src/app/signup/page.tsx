"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Globe, Mail, Lock, User, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.includes("@")) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          websiteUrl: websiteUrl.trim(),
          source: "landing_signup",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      window.location.href = "https://dash.gedi.dev/onboarding";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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
          <h1 className="text-2xl font-semibold text-grad-light">Create your account</h1>
          <p className="mt-2 text-sm text-grad-subtle">Start ranking in AI search in under 5 minutes.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="name">Full name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="email">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none"
                placeholder="Min. 8 characters"
                minLength={8}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="websiteUrl">Website URL</label>
            <div className="relative">
              <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none"
                placeholder="yourcompany.com"
                required
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Start ranking in AI search
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
