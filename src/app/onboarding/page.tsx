"use client";

import { useState } from "react";
import { ArrowRight, Globe } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");
  const [audiences, setAudiences] = useState<string[]>([""]);
  const [competitors, setCompetitors] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateStep1() {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      setErrors({});
      return true;
    } catch {
      setErrors({ url: "Enter a valid website URL (e.g. example.com)." });
      return false;
    }
  }

  function validateStep2() {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = "Please describe your business.";
    if (!audiences.filter(Boolean).length) errs.audience = "Add at least one target audience.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3) submitAll();
  }

  async function submitAll() {
    const filled = competitors.filter(Boolean);
    if (!filled.length) {
      setErrors({ competitors: "Add at least one competitor domain." });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    window.location.href = "https://dash.gedi.dev/dashboard";
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-xl px-4 py-16 sm:py-24">
        <div className="mb-8 flex items-center gap-3">
          <img src="/future.webp" alt="Gedi" className="h-8 w-8" />
          <span className="text-lg font-medium text-grad-light">Gedi</span>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-border">
            <div className="h-1 rounded-full bg-highlight transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
          <span className="text-xs font-medium text-muted">{step}/3</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-highlight" />
            <p className="mt-6 text-lg font-medium text-grad-light">Finding your best keywords...</p>
            <p className="mt-2 text-sm text-muted">Analyzing your site and competitors to build your content strategy.</p>
          </div>
        ) : step === 1 ? (
          <div className="mt-10">
            <h1 className="text-2xl font-semibold text-grad-light">Connect your website</h1>
            <p className="mt-2 text-sm text-grad-subtle">Enter your domain so we can understand your current SEO position.</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Website URL {errors.url && <span className="text-red-400">({errors.url})</span>}</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input name="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" placeholder="example.com" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border border-border bg-surface py-2.5 px-3 text-sm text-grad-subtle focus:border-muted focus:outline-none">
                  <option>English</option>
                  <option>Portuguese</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>

            <button onClick={handleNext} className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90 sm:w-auto sm:px-8">
              Next <ArrowRight size={16} />
            </button>
          </div>
        ) : step === 2 ? (
          <div className="mt-10">
            <h1 className="text-2xl font-semibold text-grad-light">Define your audience</h1>
            <p className="mt-2 text-sm text-grad-subtle">Help us understand who you write for and what your business does.</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Business description {errors.description && <span className="text-red-400">({errors.description})</span>}</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-border bg-surface py-2.5 px-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" rows={3} placeholder="Describe what your company does in a few sentences..." />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Target audience {errors.audience && <span className="text-red-400">({errors.audience})</span>}</label>
                {audiences.map((value, i) => (
                  <input key={i} value={value} onChange={(e) => setAudiences((items) => items.map((v, j) => (j === i ? e.target.value : v)))} className="mb-2 w-full rounded-lg border border-border bg-surface py-2.5 px-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" placeholder={`Audience ${i + 1}`} />
                ))}
                <button type="button" onClick={() => setAudiences((items) => [...items, ""])} className="text-xs font-medium text-grad-subtle hover:text-grad-light">+ Add audience</button>
              </div>
            </div>

            <button onClick={handleNext} className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90 sm:w-auto sm:px-8">
              Next <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-10">
            <h1 className="text-2xl font-semibold text-grad-light">Competitor Analysis</h1>
            <p className="mt-2 text-sm text-grad-subtle">Save competitor domains as context for drafts.</p>

            <div className="mt-8 space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-grad-light">Competitor context</p>
                <ul className="mb-4 list-inside list-disc text-xs text-muted">
                  <li>Save competitor domains for later research</li>
                  <li>Gedi uses these to analyze content gaps</li>
                </ul>

                <label className="mb-1.5 block text-xs font-medium text-muted">Competitor domains {errors.competitors && <span className="text-red-400">({errors.competitors})</span>}</label>
                {competitors.map((value, i) => (
                  <input key={i} name="competitor" value={value} onChange={(e) => setCompetitors((items) => items.map((v, j) => (j === i ? e.target.value : v)))} className="mb-2 w-full rounded-lg border border-border bg-surface py-2.5 px-3 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" placeholder="competitor.com" />
                ))}
                <button type="button" onClick={() => setCompetitors((items) => [...items, ""])} className="text-xs font-medium text-grad-subtle hover:text-grad-light">+ Add competitor</button>
              </div>
            </div>

            <button onClick={handleNext} className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90 sm:w-auto sm:px-8">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
