"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Globe, Loader2, Star } from "lucide-react";
import { ResultsCarousel } from "@/components/results-carousel";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dash.gedi.dev";
const ONBOARDING_STORAGE_KEY = "gedi_landing_onboarding";

const goals = [
  { id: "leads", icon: "1", title: "Get new leads", desc: "More qualified visitors into potential customers" },
  { id: "customers", icon: "2", title: "Get more customers", desc: "Turn organic traffic into paying customers" },
  { id: "authority", icon: "3", title: "Build brand authority", desc: "Establish expertise and trust in your niche" },
  { id: "costs", icon: "4", title: "Lower marketing costs", desc: "Replace expensive agencies with automation" },
];

const trafficLevels = [
  { id: "0-100", range: "0\u2013100", label: "0\u2013100 visitors/month", desc: "Just getting started" },
  { id: "100-1k", range: "100\u20131K", label: "100\u20131,000 visitors/month", desc: "Early stage growth" },
  { id: "1k-10k", range: "1K\u201310K", label: "1,000\u201310,000 visitors/month", desc: "Growing steadily" },
  { id: "10k+", range: "10K+", label: "10,000+ visitors/month", desc: "Scaling up fast" },
];

const loadingSteps = [
  { label: "Scanning your website", sub: "Reading your pages, content, and niche" },
  { label: "Checking your current rankings", sub: "Seeing where you already show up on Google" },
  { label: "Researching your competitors", sub: "Finding what they rank for and where they're weak" },
  { label: "Finding keyword opportunities", sub: "Searching for topics your audience cares about" },
  { label: "Analyzing search volumes", sub: "Calculating how many people search for these topics" },
  { label: "Checking AI search visibility", sub: "Reviewing your presence on ChatGPT, Gemini, and Perplexity" },
  { label: "Estimating your traffic potential", sub: "Projecting how much traffic you could get" },
  { label: "Building your growth plan", sub: "Putting together your strategy" },
];

const faqItems = [
  { q: "How quickly will I see results?", a: "Most users see their first articles indexed within days. Traffic growth typically begins within 2-4 weeks as content starts ranking for long-tail keywords." },
  { q: "Is AI content as good as human writers?", a: "Yes. Gedi uses advanced AI models fine-tuned for SEO. Every article includes proper formatting, internal links, images, and is optimized for both Google and AI search engines." },
  { q: "Do I need SEO experience?", a: "None. Gedi handles keyword research, content strategy, writing, and publishing automatically. You just connect your site and review the results." },
  { q: "Will this work for AI search too?", a: "Absolutely. Gedi optimizes for GEO (Generative Engine Optimization) so your content gets cited by ChatGPT, Perplexity, Gemini, and Claude." },
  { q: "How do I publish articles?", a: "Connect your WordPress, Shopify, Webflow, or Wix site once. Gedi auto-publishes on your schedule. No manual work required." },
  { q: "Is the content unique?", a: "Every article is generated fresh based on your niche, keywords, and brand voice. No templates, no duplicate content." },
  { q: "What if I'm not sure?", a: "You can cancel anytime. No long-term contracts. Your access continues until the end of your billing period." },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [goal, setGoal] = useState("");
  const [traffic, setTraffic] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [yearly, setYearly] = useState(false);
  const [restored, setRestored] = useState(false);
  const [leadId, setLeadId] = useState("");

  const totalSteps = 11;
  const progress = step <= 0 ? 0 : Math.round((step / (totalSteps - 1)) * 100);

  function normalizeUrl(raw: string) {
    const t = raw.trim();
    if (!t) return "";
    return /^https?:\/\//i.test(t) ? t : `https://${t}`;
  }

  function extractName(raw: string) {
    try {
      const host = new URL(normalizeUrl(raw) || "https://example.com").hostname;
      return host.replace(/^www\./, "").split(".")[0] || host;
    } catch {
      return raw;
    }
  }

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!saved) {
        setRestored(true);
        return;
      }
      const data = JSON.parse(saved);
      if (typeof data.step === "number") setStep(data.step);
      if (typeof data.url === "string") setUrl(data.url);
      if (typeof data.siteName === "string") setSiteName(data.siteName);
      if (typeof data.goal === "string") setGoal(data.goal);
      if (typeof data.traffic === "string") setTraffic(data.traffic);
      if (typeof data.email === "string") setEmail(data.email);
      if (typeof data.yearly === "boolean") setYearly(data.yearly);
      if (typeof data.leadId === "string") setLeadId(data.leadId);
    } catch {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } finally {
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!restored) return;
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({
        step,
        url,
        siteName,
        goal,
        traffic,
        email,
        yearly,
        leadId,
        updatedAt: new Date().toISOString(),
      }),
    );
  }, [email, goal, leadId, restored, siteName, step, traffic, url, yearly]);

  useEffect(() => {
    if (!restored) return;
    if (!url && !goal && !traffic && !email) return;

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`${APP_URL}/api/landing/onboarding`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId: leadId || undefined,
            step,
            email,
            websiteUrl: normalizeUrl(url),
            siteName,
            goal,
            traffic,
            plan: yearly ? "yearly" : "monthly",
            source: "landing_onboarding",
            payload: {
              url,
              yearly,
            },
          }),
        });
        if (!response.ok) return;
        const body = await response.json();
        if (body.lead?.id && body.lead.id !== leadId) setLeadId(body.lead.id);
      } catch {}
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [email, goal, leadId, restored, siteName, step, traffic, url, yearly]);

  function handleContinue() {
    if (step === 0) {
      const normalized = normalizeUrl(url);
      if (!normalized || !/^https?:\/\/.+\..+/.test(normalized)) return;
      setSiteName(extractName(url));
      setStep(1);
    } else if (step === 1 && goal) {
      setStep(2);
    } else if (step === 2 && traffic) {
      setStep(3);
    } else if (step >= 3 && step < 7) {
      setStep((s) => s + 1);
    } else if (step === 7) {
      setStep(8);
    } else if (step === 9 && emailValid) {
      setStep(10);
    }
  }

  function handleGoalClick(g: string) {
    setGoal(g);
    setTimeout(() => setStep(2), 300);
  }

  function handleTrafficClick(t: string) {
    setTraffic(t);
    setTimeout(() => setStep(3), 300);
  }

  useEffect(() => {
    if (step !== 8) return;
    if (loadingStep >= loadingSteps.length) {
      setTimeout(() => setStep(9), 800);
      return;
    }
    const t = setTimeout(() => setLoadingStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [step, loadingStep]);

  useEffect(() => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [email]);

  const description = "an AI quality platform connecting real-world failures to domain experts";
  const trafficLabel = trafficLevels.find((t) => t.id === traffic)?.range || "growing";
  const goalLabel = goals.find((g) => g.id === goal)?.title?.toLowerCase() || "growing your business";
  const articleCount = 30;
  const wordCount = 1500;
  const price = yearly ? 19 : 29;
  const originalPrice = 49;
  const signupHref = (() => {
    const params = new URLSearchParams({
      email,
      websiteUrl: normalizeUrl(url),
      leadId,
      goal,
      traffic,
      source: "landing_onboarding",
    });
    return `${APP_URL}/signup?${params.toString()}`;
  })();

  // STEP 8: Loading
  if (step === 8) {
    return (
      <div className="min-h-screen bg-bg px-4 pt-24 pb-24">
        <TrialBanner />
        <Header progress={100} />
        <div className="mx-auto mt-12 max-w-xl">
          <div className="flex-1 rounded-2xl border border-border bg-surface px-5 py-4">
            <h2 className="text-lg font-semibold text-grad-light">Analyzing your business...</h2>
            <p className="mt-1 text-sm text-grad-subtle">Building your personalized growth plan.</p>
          </div>
          <div className="mt-6 space-y-3">
            {loadingSteps.map((ls, i) => {
              const done = i < loadingStep;
              const current = i === loadingStep;
              return (
                <div key={ls.label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${done ? "border-muted/30 bg-surface" : current ? "border-muted bg-surface" : "border-border bg-bg"}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${done ? "bg-highlight text-bg" : current ? "bg-highlight text-bg" : "bg-border text-muted"}`}>
                    {done ? <Check size={12} /> : current ? <Loader2 size={12} className="animate-spin" /> : ""}
                  </span>
                  <div>
                    <span className={`text-sm ${done ? "font-medium text-grad-light" : current ? "font-medium text-grad-light" : "text-muted"}`}>{ls.label}</span>
                    {current && <p className="text-xs text-muted mt-0.5">{ls.sub}</p>}
                  </div>
                  <span className="ml-auto text-xs text-muted">{done ? "Done" : current ? "In progress" : "Pending"}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg/90 backdrop-blur-xl">
          <div className="mx-auto max-w-xl px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted">Almost there...</span>
              <span className="text-grad-subtle">2 steps remaining</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-highlight transition-all duration-500" style={{ width: "80%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 10: Results page
  if (step === 10) {
    return (
      <div className="min-h-screen bg-bg">
        <TrialBanner />
        <div className="fixed top-9 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <a href="/" className="flex items-center gap-2">
              <img src="/future.webp" alt="Gedi" className="h-6 w-6 grayscale" />
              <span className="text-sm font-medium text-grad-light">Gedi</span>
            </a>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-grad-subtle sm:inline">Limited time: 40% off first month</span>
              <a href="#pricing" className="rounded-lg bg-highlight px-4 py-1.5 text-xs font-medium text-bg">Claim 40% OFF</a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 pt-28 pb-24 space-y-16">
          {/* Result preview */}
          <section className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="grid h-6 w-6 place-items-center rounded bg-border text-[10px] font-bold text-grad-subtle">{siteName?.[0]?.toUpperCase() || "S"}</div>
                <span className="text-sm font-medium text-grad-light">{siteName || url}</span>
              </div>
              <h2 className="text-xl font-semibold text-grad-light">Your growth plan is ready!</h2>
              <p className="mt-2 text-sm leading-relaxed text-grad-subtle">I found a clear path to grow your traffic and get more customers from Google and AI search. You should see your first growth signals in the first 2 weeks!</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs font-medium text-grad-subtle mb-3 uppercase tracking-wider">Traffic Growth Projection — 12 Months</p>
              <div className="flex items-end gap-1.5 h-32 sm:h-40">
                {[6, 10, 14, 20, 24, 32, 38, 48, 56, 70, 82, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1.5">
                    <div className="w-full rounded-t-sm bg-gradient-to-t from-highlight/60 to-highlight transition-all hover:from-highlight/80 hover:to-highlight" style={{ height: `${h}%` }}>
                      <div className="w-full h-full bg-highlight/30 rounded-t-sm" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${100 - i * 4}%, 0 ${100 - i * 3}%)` }} />
                    </div>
                    <span className="text-[9px] text-grad-subtle">{["Jul","Ago","Set","Out","Nov","Dez","Jan","Fev","Mar","Abr","Mai","Jun"][i]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-grad-subtle">Month 1: ~500 visits</span>
                <span className="text-grad-light font-medium">Month 12: 25,000+ visits</span>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-grad-light">Unlock Traffic on Autopilot</h2>
              <p className="mt-2 text-sm text-grad-subtle">Keyword research, daily articles, auto-publishing, and backlinks included. For less than a single freelance article.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">Monthly</span>
              <button onClick={() => setYearly(!yearly)} className={`relative h-6 w-11 rounded-full transition ${yearly ? "bg-highlight" : "bg-border"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${yearly ? "left-6" : "left-0.5"}`} />
              </button>
              <span className="text-xs text-grad-subtle">Yearly <span className="text-grad-light font-medium">Save 35%</span></span>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted uppercase tracking-wider">Business</span>
                <span className="rounded-full bg-highlight/10 px-3 py-0.5 text-xs font-medium text-grad-light">1 website</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-grad-light">Business Plan</h3>
              <p className="mt-1 text-sm text-grad-subtle">Everything you need to grow organic traffic</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-sm text-muted line-through">${originalPrice}</span>
                <span className="text-3xl font-bold text-grad-light">${price}</span>
                <span className="text-sm text-muted">/month</span>
              </div>
              <a href={signupHref} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90">
                Buy Now <ArrowRight size={16} />
              </a>
              <p className="mt-2 text-xs text-muted">40% off your first month at ${price}/month, then ${originalPrice}/month. Cancel anytime.</p>
              <div className="mt-5 space-y-2 border-t border-border pt-5">
                {["Personalized growth plan", `${articleCount} SEO/GEO articles (1 daily)`, `${wordCount}+ word long-form articles`, "Auto-publish to your website", "10 backlink credits monthly", "Auto images, links & promotion", "Unlimited rewrites & team members"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-grad-subtle"><Check size={14} className="text-highlight shrink-0" /> {f}</div>
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-muted">Your account will be created with <span className="text-grad-subtle">{email}</span></p>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-sm font-medium text-grad-light">Satisfaction Guarantee</p>
              <p className="mt-1 text-xs text-grad-subtle">Try Gedi risk-free. Grow your traffic and cancel anytime, no hidden fees or long-term contracts. Access continues until the end of your billing period.</p>
            </div>
          </section>

          {/* Growth potential */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-grad-light">Your Growth Potential</h2>
              <p className="mt-1 text-sm text-grad-subtle">This is how your traffic could grow over 12 months with daily publishing.</p>
            </div>
            <div className="grid gap-3">
              {[
                { months: "Months 1\u20133", range: "500\u20132,000", desc: "Your articles get indexed, first visitors arrive, and long-tail keywords start ranking." },
                { months: "Months 3\u20136", range: "2,000\u20138,000", desc: "Your domain gains authority, more keywords rank, and traffic becomes consistent." },
                { months: "Months 6\u201312", range: "8,000\u201325,000+", desc: "Competitive keywords rank, AI search engines cite you, and traffic compounds." },
              ].map((p) => (
                <div key={p.months} className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm font-medium text-grad-light">{p.months}</p>
                  <p className="text-lg font-semibold text-grad-light mt-1">{p.range} visitors/mo</p>
                  <p className="text-xs text-grad-subtle mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-grad-light">Here&apos;s How Gedi Will Grow Your Traffic</h2>
              <p className="mt-1 text-sm text-grad-subtle">No content writing, no manual publishing, no SEO expertise needed. You set it up once and Gedi handles everything 24/7.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { step: "01", title: "Unlock Your Plan", desc: "Gedi already analyzed your niche and found the best keywords. Unlock to see the full list." },
                { step: "02", title: "Pick Keywords & Schedule", desc: "Choose keywords, drag onto your calendar, and Gedi starts writing. Schedule months in one session." },
                { step: "03", title: "Gedi Writes Articles Daily", desc: `Every day a ${wordCount}+ word article with images, internal links, and formatting. Optimized for Google and AI.` },
                { step: "04", title: "Auto-Publish & Grow", desc: "Connect your blog once. Gedi publishes automatically. Watch traffic grow on autopilot." },
              ].map((s) => (
                <div key={s.step} className="rounded-xl border border-border bg-surface p-5">
                  <span className="text-xs font-medium text-muted">STEP {s.step}</span>
                  <h3 className="mt-2 text-sm font-semibold text-grad-light">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-grad-subtle">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What's included */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-grad-light">What&apos;s Included</h2>
              <p className="mt-1 text-sm text-grad-subtle">Everything you need to grow your organic traffic, all in one plan.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: "1", value: articleCount.toString(), label: "SEO articles per month", sub: `${wordCount}+ word long-form articles` },
                { icon: "2", value: "50+", label: "Keywords researched", sub: "Low competition, high traffic keywords" },
                { icon: "3", value: "10", label: "Backlinks per month", sub: "Quality links that build domain authority" },
                { icon: "4", value: "24/7", label: "Auto-publishing", sub: "WordPress, Shopify, Webflow, Wix" },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-2xl font-bold text-grad-light">{c.value}</p>
                  <p className="text-sm font-medium text-grad-light mt-1">{c.label}</p>
                  <p className="text-xs text-grad-subtle mt-0.5">{c.sub}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {["Auto internal & external linking", "AI image generation", "Auto research & competitor analysis", "Auto promotion & business mentions", "Customizable brand voice & tone", "Unlimited rewrites & team members", "Personal growth assistant", "Cancel anytime"].map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-grad-subtle">{t}</span>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-grad-light">What Others Are Achieving</h2>
              <p className="mt-1 text-sm text-grad-subtle">Real results from real businesses using Gedi.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { pct: "340%", label: "traffic increase", stars: 5, quote: "Gedi rewired our content strategy completely.", name: "Sarah Chen", role: "Head of Growth at Verida" },
                { pct: "12K/day", label: "impressions", stars: 5, quote: "Our AI search visibility tripled in a month.", name: "David Park", role: "VP Marketing at Nuro" },
                { pct: "8,500", label: "visitors in 2 weeks", stars: 5, quote: "I was skeptical about AI content. Now I'm a believer.", name: "James Turner", role: "Founder at ShipFast" },
              ].map((t) => (
                <div key={t.name} className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-2xl font-bold text-grad-light">{t.pct}</p>
                  <p className="text-xs text-muted">{t.label}</p>
                  <div className="mt-2 flex gap-0.5 text-highlight">{Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
                  <p className="mt-2 text-sm text-grad-subtle">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-3 border-t border-border pt-3">
                    <p className="text-sm font-medium text-grad-light">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-5">
            <h2 className="text-xl font-semibold text-grad-light">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqItems.map((item, i) => (
                <div key={item.q} className="rounded-xl border border-border bg-surface">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-grad-light">
                    {item.q}
                    <ChevronDown size={16} className={`text-muted transition ${faqOpen === i ? "rotate-180" : ""}`} />
                  </button>
                  {faqOpen === i && <p className="px-5 pb-4 text-sm leading-relaxed text-grad-subtle">{item.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="space-y-5 text-center">
            <div className="rounded-2xl border border-border bg-surface px-5 py-4 text-left">
              <p className="text-sm text-grad-subtle">Ready to grow your traffic?</p>
              <p className="mt-1 text-sm font-medium text-grad-light">40% off your first month at ${price}/month, then ${originalPrice}/month. Cancel anytime.</p>
            </div>
            <a href={signupHref} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90">
              Get Traffic on Autopilot <ArrowRight size={16} />
            </a>
          </section>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg/90 backdrop-blur-xl">
          <div className="mx-auto max-w-xl px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted">Step 10 of 10</span>
              <span className="text-grad-light font-medium">Complete</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-highlight" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEPS 0–7 and 9
  return (
    <div className="min-h-screen bg-bg px-4 pt-24 pb-24">
      <TrialBanner />
      <Header progress={progress} onBack={step > 0 && step < 8 ? () => setStep((s) => s - 1) : undefined} />

      <div className="mx-auto mt-8 max-w-xl space-y-5">
        {/* Step 0: URL entry */}
        {step === 0 && (
          <>
            <div className="flex-1 rounded-2xl border border-border bg-surface px-5 py-4">
              <h2 className="text-lg font-semibold text-grad-light">Enter your website URL</h2>
              <p className="mt-1 text-sm leading-relaxed text-grad-subtle">I&apos;ll scan your site and build a personalized content plan to grow your traffic from Google, ChatGPT, and other search engines.</p>
            </div>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleContinue()} className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" placeholder="example.com" />
            </div>
            <button onClick={handleContinue} disabled={!url.trim()} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40">
              Continue <ArrowRight size={16} />
            </button>
            <SocialProof />
          </>
        )}

        {/* Step 1: Goal */}
        {step === 1 && (
          <>
            <div className="flex-1 rounded-2xl border border-border bg-surface px-5 py-4">
                <h2 className="text-lg font-semibold text-grad-light">What&apos;s your main goal?</h2>
                <p className="mt-1 text-sm leading-relaxed text-grad-subtle">I&apos;ll prioritize keywords and content topics based on what matters most to your business.</p>
              </div>
            <div className="space-y-3">
              {goals.map((g) => (
                <button key={g.id} onClick={() => handleGoalClick(g.id)} className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${goal === g.id ? "border-muted bg-surface ring-1 ring-muted/30" : "border-border bg-surface hover:border-muted"}`}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-bg text-sm font-semibold text-grad-light">{g.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-grad-light">{g.title}</p>
                    <p className="text-xs text-grad-subtle mt-0.5">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Traffic */}
        {step === 2 && (
          <>
            <div className="flex-1 rounded-2xl border border-border bg-surface px-5 py-4">
                <h2 className="text-lg font-semibold text-grad-light">How much traffic do you currently get?</h2>
                <p className="mt-1 text-sm leading-relaxed text-grad-subtle">This helps me understand your starting point and estimate your growth potential.</p>
              </div>
            <div className="space-y-3">
              {trafficLevels.map((t) => (
                <button key={t.id} onClick={() => handleTrafficClick(t.id)} className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${traffic === t.id ? "border-muted bg-surface ring-1 ring-muted/30" : "border-border bg-surface hover:border-muted"}`}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-bg text-xs font-bold text-grad-light">{t.range}</span>
                  <div>
                    <p className="text-sm font-semibold text-grad-light">{t.label}</p>
                    <p className="text-xs text-grad-subtle mt-0.5">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 3: AI Analysis */}
        {step === 3 && <InfoStep title={`I took a look at ${siteName || url}`} text={`You're ${description}. With ${trafficLabel} monthly visitors and a focus on ${goalLabel}, boosting your search visibility is key. Gedi will automatically publish over ${articleCount} SEO articles each month, targeting the keywords your potential audience is actively searching for. We'll also build backlinks to help elevate your site's ranking on Google and AI search engines, ensuring you reach the right people.`} onContinue={handleContinue} />}

        {/* Step 4: AI Search wave */}
        {step === 4 && (
          <InfoStep title="Get ahead of the AI search wave" text="Millions now search on ChatGPT, Claude, and Perplexity. Early adopters are capturing traffic before competition catches up." onContinue={handleContinue}>
            <p className="mt-3 text-sm leading-relaxed text-grad-subtle">Gedi publishes SEO and GEO-optimized articles daily so your business gets found on both Google and every major AI search engine.</p>
            <div className="mt-4 space-y-2">
              {["1 billion+ weekly ChatGPT users", "Less than 5% of businesses optimize for AI search", "AI search usage is doubling every few months"].map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-grad-subtle"><Check size={14} className="text-highlight shrink-0" /> {b}</div>
              ))}
            </div>
          </InfoStep>
        )}

        {/* Step 5: Google Search */}
        {step === 5 && (
          <InfoStep title="Let's get your traffic from Google" text="You're already getting Google traffic — great! There's likely 10x more opportunity with the right keyword strategy." onContinue={handleContinue}>
            <p className="mt-3 text-sm leading-relaxed text-grad-subtle">I&apos;ll research the best keywords for your niche and publish articles daily so your rankings compound over time.</p>
            <div className="mt-4 space-y-2">
              {["8.5 billion daily Google searches", "5.66x higher ROI than paid ads", "Free traffic that compounds over time", "Daily publishing = 4x more traffic"].map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-grad-subtle"><Check size={14} className="text-highlight shrink-0" /> {b}</div>
              ))}
            </div>
          </InfoStep>
        )}

        {/* Step 6: What Gedi will do */}
        {step === 6 && (
          <InfoStep title="Here's what Gedi will do for you" text="Most businesses struggle with content because it takes too much time. That's exactly what Gedi was built to solve." onContinue={handleContinue}>
            <div className="mt-4 space-y-3">
              {[
                { n: "1", title: "Gedi analyzes your niche", desc: "Find keywords your competitors are missing" },
                { n: "2", title: "Gedi writes articles daily", desc: `${wordCount}+ words with images, links, and formatting` },
                { n: "3", title: "Gedi publishes to your website", desc: "Auto-publish directly to your site. No manual work" },
                { n: "4", title: "Your traffic grows", desc: "Google, ChatGPT, and other search engines" },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-bg text-xs font-bold text-grad-light">{s.n}</span>
                  <div>
                    <p className="text-sm font-semibold text-grad-light">{s.title}</p>
                    <p className="text-xs text-grad-subtle mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              {["Google","ChatGPT","Perplexity","Gemini","Claude"].map((p) => (
                <span key={p} className="rounded-full border border-border px-3 py-1 text-xs text-grad-subtle">{p}</span>
              ))}
              <span className="text-xs text-muted">+ more</span>
            </div>
          </InfoStep>
        )}

        {/* Step 7: Case study */}
        {step === 7 && (
          <>
            <h2 className="text-xl font-semibold text-grad-light">Real results from real businesses</h2>
            <p className="text-sm text-grad-subtle">See what other business owners achieved with Gedi on autopilot, starting from zero.</p>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex justify-center gap-1.5 mb-4">
                {[0, 1, 2].map((d) => <span key={d} className={`h-1.5 w-1.5 rounded-full ${d === 0 ? "bg-highlight" : "bg-border"}`} />)}
              </div>
              <div className="rounded-xl bg-bg p-4">
                <div className="flex items-end gap-1 h-16">
                  {[15, 25, 20, 40, 35, 55, 45, 65, 55, 80, 70, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-highlight" style={{ height: `${h}%`, opacity: 0.3 + i * 0.055 }} />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-grad-light">12K</p>
              <p className="text-sm text-grad-subtle">clicks/month</p>
              <p className="mt-1 text-xs text-muted">After 3 months on Gedi</p>
              <div className="mt-3 flex gap-0.5 text-highlight">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
              <p className="mt-3 text-sm leading-relaxed text-grad-subtle">&ldquo;We went from zero GPT mentions to being the #1 cited source in our category in 3 weeks. Gedi rewired our content strategy.&rdquo;</p>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-bg text-xs font-bold text-grad-light">SC</div>
                <div>
                  <p className="text-sm font-medium text-grad-light">Sarah Chen</p>
                  <p className="text-xs text-muted">Head of Growth at Verida</p>
                </div>
              </div>
            </div>
            <button onClick={handleContinue} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90">
              Continue <ArrowRight size={16} />
            </button>
          </>
        )}

        {/* Step 9: Email capture */}
        {step === 9 && (
          <>
            <div className="flex-1 rounded-2xl border border-border bg-surface px-5 py-4">
              <h2 className="text-lg font-semibold text-grad-light">Save your progress</h2>
              <p className="mt-1 text-sm leading-relaxed text-grad-subtle">Enter your email to save your personalized growth plan.</p>
            </div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleContinue()} className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-sm text-grad-subtle placeholder:text-muted focus:border-muted focus:outline-none" placeholder="Enter your email..." />
            <button onClick={handleContinue} disabled={!emailValid} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40">
              Continue <ArrowRight size={16} />
            </button>
            <SocialProof />
          </>
        )}
      </div>
      {step < 8 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg/90 backdrop-blur-xl">
          <div className="mx-auto max-w-xl px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted">Step {step + 1} of 10</span>
              <span className="text-grad-subtle">{10 - (step + 1)} steps remaining</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-highlight transition-all duration-500" style={{ width: `${Math.round(((step + 1) / 10) * 100)}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrialBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-9 max-w-xl items-center justify-center gap-2 px-4">
        <span className="h-1.5 w-1.5 rounded-full bg-highlight animate-pulse" />
        <p className="text-xs text-grad-subtle">
          <span className="font-medium text-grad-light">7-day free trial</span> — Finish your onboarding
        </p>
      </div>
    </div>
  );
}

function Header({ progress, onBack }: { progress: number; onBack?: () => void }) {
  return (
    <div className="mx-auto max-w-xl space-y-3">
      <div className="flex items-center justify-between">
        {onBack ? (
          <button onClick={onBack} className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-3 text-xs text-grad-subtle transition-colors hover:border-muted hover:text-grad-light">
            <ArrowLeft size={14} /> Back
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <img src="/future.webp" alt="Gedi" className="h-6 w-6 grayscale" />
          <span className="text-sm font-medium text-grad-light">Gedi</span>
        </div>
        <div className="w-16" />
      </div>
      {progress > 0 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-highlight transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function InfoStep({ title, text, onContinue, children }: { title: string; text: string; onContinue: () => void; children?: React.ReactNode }) {
  return (
    <>
      <div className="flex-1 rounded-2xl border border-border bg-surface px-5 py-4">
        <h2 className="text-lg font-semibold text-grad-light">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-grad-subtle">{text}</p>
        {children}
      </div>
      <button onClick={onContinue} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-highlight text-sm font-medium text-bg transition-opacity hover:opacity-90">
        Continue <ArrowRight size={16} />
      </button>
    </>
  );
}

function SocialProof() {
  const avatars = [
    "https://i.pravatar.cc/96?img=1",
    "https://i.pravatar.cc/96?img=5",
    "https://i.pravatar.cc/96?img=3",
    "https://i.pravatar.cc/96?img=8",
    "https://i.pravatar.cc/96?img=11",
  ];

  return (
    <div className="flex flex-col items-center gap-4 pt-2">
      <div className="flex -space-x-2">
        {avatars.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-bg object-cover grayscale"
            loading="lazy"
          />
        ))}
      </div>
      <div className="flex gap-0.5 text-highlight">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
      <p className="text-xs text-muted">3,000+ happy customers</p>
      <ResultsCarousel />
    </div>
  );
}
