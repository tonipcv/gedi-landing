export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <Hero />
      <Stats />
      <Testimonials id="testimonials" />
      <HowItWorks />
      <Comparison />
      <RiskFree />
      <TestimonialsSecond id="testimonials2" />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2 sm:gap-3">
          <img src="/future.webp" alt="Gedi" className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="text-base font-medium tracking-[-0.02em] text-grad-light sm:text-lg">Gedi</span>
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#how" className="hidden text-xs text-silver transition-colors hover:text-grad-subtle sm:inline">
            How it works
          </a>
          <a href="#compare" className="hidden text-xs text-silver transition-colors hover:text-grad-subtle sm:inline">
            Compare
          </a>
          <a href="#testimonials" className="hidden text-xs text-silver transition-colors hover:text-grad-subtle sm:inline">
            Customers
          </a>
          <a
            href="/signup"
            className="inline-flex h-8 items-center rounded-lg bg-highlight px-3 text-xs font-medium text-bg transition-opacity hover:opacity-90 sm:px-4"
          >
            Start free
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-12 text-center sm:px-6 sm:pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="mb-6 sm:mb-8">
          <img src="/top2.png" alt="Gedi Dashboard" className="mx-auto w-full max-w-4xl" />
        </div>

        <h1 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-grad sm:text-[42px] md:text-[56px] md:leading-[1.08]">
          Your Brand in Top 1 When Someone Ask in GPT
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-grad-subtle sm:mt-6 sm:text-base">
          Gedi optimizes your content for AI-powered search engines. ChatGPT, Perplexity, Gemini — your brand shows up first when it matters most.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center">
          <a
            href="/signup"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-highlight px-7 text-sm font-medium text-bg transition-opacity hover:opacity-90 sm:w-auto"
          >
            Start ranking in AI search
          </a>
          <a
            href="#how"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-border px-7 text-sm text-grad-subtle transition-colors hover:border-muted hover:text-grad-light sm:w-auto"
          >
            See how it works
          </a>
        </div>

        <p className="mt-4 text-xs text-muted">No credit card required. 7-day free trial.</p>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "84%", label: "of GPT answers cite external sources" },
    { value: "2.7B", label: "monthly ChatGPT queries and growing" },
    { value: "60%", label: "of searches will be AI-powered by 2027" },
    { value: "-73%", label: "Google organic traffic decline on AI-answered queries" },
  ];

  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
          The Shift Is Already Happening
        </p>
        <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-grad-light sm:text-3xl">
          AI search is passing Google
        </h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 bg-surface px-6 py-10">
              <span className="text-[40px] font-semibold tracking-tight text-grad-stat">
                {stat.value}
              </span>
              <span className="text-center text-xs leading-relaxed text-grad-subtle">{stat.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Sources: Gartner, Similarweb, SparkToro, Search Engine Land
        </p>
      </div>
    </section>
  );
}

function Testimonials({ id }: { id: string }) {
  const quotes = [
    {
      text: "We went from zero GPT mentions to being the #1 cited source in our category in 3 weeks. Gedi rewired our content strategy.",
      name: "Sarah Chen",
      role: "Head of Growth at Verida",
    },
    {
      text: "Our traffic from AI search tools grew 340% quarter over quarter. The ROI is insane compared to any other channel.",
      name: "Marcus Rivera",
      role: "CEO at ScaleMetrics",
    },
    {
      text: "Google Ads cost us $12k/month for similar results. Gedi delivers better-qualified traffic at a fraction of the cost.",
      name: "Elena Kowalski",
      role: "Marketing Director at Flux AI",
    },
  ];

  return (
    <section id={id} className="border-t border-border px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Trusted by Forward-Thinking Teams
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q) => (
            <div key={q.name} className="gradient-border rounded-xl bg-surface p-6">
              <p className="text-sm leading-relaxed text-grad-subtle">&ldquo;{q.text}&rdquo;</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-medium text-grad-light">{q.name}</p>
                <p className="text-xs text-muted">{q.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Connect your website",
      description: "Link your site in 30 seconds. Gedi scans your pages, competitors, and identifies content gaps.",
    },
    {
      step: "02",
      title: "AI generates optimized content",
      description: "Articles tailored for AI search engines and structured data that GPT and Perplexity use as sources.",
    },
    {
      step: "03",
      title: "Auto-publish on schedule",
      description: "Content goes live on WordPress, Shopify, Webflow, or Wix on your preferred cadence.",
    },
    {
      step: "04",
      title: "Watch your AI rankings climb",
      description: "Track mentions in ChatGPT, impressions in Search Console, and organic traffic growth.",
    },
  ];

  return (
    <section id="how" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
          How Gedi Works
        </p>
        <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-grad-light sm:text-3xl">
          From zero to AI-ranked in four steps
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="gradient-border rounded-xl bg-surface p-6">
              <span className="text-xs font-medium text-muted">{s.step}</span>
              <h3 className="mt-3 text-sm font-semibold text-grad-light">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-grad-subtle">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    { label: "Monthly cost", gedi: "$19", ads: "$500 – $2,000+", fb: "$300 – $1,500+", other: "$99 – $499" },
    { label: "Setup time", gedi: "5 minutes", ads: "Days to weeks", fb: "Days", other: "Hours to days" },
    { label: "Content creation", gedi: "Automated", ads: "Manual", fb: "Manual", other: "Manual or outsourced" },
    { label: "AI search ranking", gedi: "Built-in", ads: "No", fb: "No", other: "Limited" },
    { label: "Organic traffic", gedi: "Compounds over time", ads: "Stops when you stop paying", fb: "Stops when you stop paying", other: "Varies" },
    { label: "Publishing", gedi: "Automated multi-platform", ads: "N/A", fb: "N/A", other: "Manual" },
  ];

  return (
    <section id="compare" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Why Gedi
        </p>
        <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-grad-light sm:text-3xl">
          Same reach. Fraction of the cost.
        </h2>

        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pr-4 font-medium text-muted" />
                <th className="pb-3 pr-4 font-semibold text-grad-light">Gedi</th>
                <th className="pb-3 pr-4 font-medium text-muted">Google Ads</th>
                <th className="pb-3 pr-4 font-medium text-muted">Facebook Ads</th>
                <th className="pb-3 pr-4 font-medium text-muted">Other SEO tools</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border">
                  <td className="py-3 pr-4 text-muted">{row.label}</td>
                  <td className="py-3 pr-4 font-medium text-grad-subtle">{row.gedi}</td>
                  <td className="py-3 pr-4 text-muted">{row.ads}</td>
                  <td className="py-3 pr-4 text-muted">{row.fb}</td>
                  <td className="py-3 pr-4 text-muted">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Ads stop the moment you stop paying. Gedi content compounds. Every article keeps working for you.
        </p>
      </div>
    </section>
  );
}

function RiskFree() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Risk Free
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-grad-light sm:text-3xl">
          Try Gedi for 7 days. No credit card.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-grad-subtle">
          If you don&apos;t see your brand showing up in AI search results within a week, cancel anytime. You keep all generated content regardless.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="/signup"
            className="inline-flex h-11 items-center rounded-lg bg-highlight px-7 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Start free trial
          </a>
          <a
            href="#testimonials2"
            className="inline-flex h-11 items-center rounded-lg border border-border px-7 text-sm text-grad-subtle transition-colors hover:border-muted hover:text-grad-light"
          >
            Read more stories
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { title: "No lock-in", desc: "Cancel anytime. You own every article we generate." },
            { title: "No hidden fees", desc: "Flat monthly pricing. No per-article charges. No surprises." },
            { title: "Proven results", desc: "Our customers see AI search mentions within the first week." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-6 text-left">
              <h3 className="text-sm font-semibold text-grad-light">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-grad-subtle">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSecond({ id }: { id: string }) {
  const quotes = [
    {
      text: "We replaced a $4k/month content agency with Gedi. Our AI search visibility tripled and we saved $45k/year.",
      name: "David Park",
      role: "VP Marketing at Nuro Analytics",
      metric: "Saved $45k/year",
    },
    {
      text: "The structured data optimization alone was worth it. GPT started citing our documentation within 2 weeks.",
      name: "Priya Sharma",
      role: "Technical SEO Lead at DevScale",
      metric: "Ranked in 2 weeks",
    },
    {
      text: "I was skeptical about AI content. But the quality surprised me. Our ChatGPT mention rate went from 0 to 12% of all branded searches.",
      name: "James Turner",
      role: "Founder at ShipFast",
      metric: "12% GPT mention rate",
    },
  ];

  return (
    <section id={id} className="border-t border-border px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
          More Stories
        </p>
        <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-grad-light sm:text-3xl">
          Teams winning with Gedi
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q) => (
            <div key={q.name} className="gradient-border rounded-xl bg-surface p-6">
              <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-grad-subtle">
                {q.metric}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-grad-subtle">&ldquo;{q.text}&rdquo;</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-medium text-grad-light">{q.name}</p>
                <p className="text-xs text-muted">{q.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-grad sm:text-4xl">
          The next wave of search is here.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-grad-subtle sm:text-base">
          AI search engines already handle billions of queries. Brands that optimize now will own the next decade of organic traffic. Don&apos;t wait until your competitors get there first.
        </p>

        <div className="mt-10">
          <a
            href="/signup"
            className="inline-flex h-12 items-center rounded-lg bg-highlight px-8 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Start ranking in AI search — free
          </a>
        </div>

        <p className="mt-4 text-xs text-muted">7-day trial. No credit card. Cancel anytime.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-xs text-muted sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Gedi. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="https://dash.gedi.dev/login" className="transition-colors hover:text-grad-subtle">
            Sign in
          </a>
          <a href="/signup" className="transition-colors hover:text-grad-subtle">
            Start free
          </a>
          <a href="mailto:gedi@kiodo.dev" className="transition-colors hover:text-grad-subtle">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
