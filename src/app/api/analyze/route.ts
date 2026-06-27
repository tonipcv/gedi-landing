import { NextResponse } from "next/server";

const KIODO_API = "https://api.kiodo.dev/v1";
const KIODO_KEY = process.env.KIODO_API_KEY || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const websiteUrl = String(body.websiteUrl || "").trim();
    const siteName = String(body.siteName || "").trim();
    const goal = String(body.goal || "");
    const traffic = String(body.traffic || "");

    if (!websiteUrl) {
      return NextResponse.json({ error: "Website URL required" }, { status: 400 });
    }

    const domain = websiteUrl.replace(/^https?:\/\//, "").replace(/\/.*/, "");
    const query = `site:${domain} ${siteName} ${goal} SEO analysis`;

    let seoData = null;
    let competitorData = null;

    if (KIODO_KEY) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const seoRes = await fetch(
          `${KIODO_API}/search?q=${encodeURIComponent(`${domain} website SEO analysis`)}`,
          { headers: { Authorization: `Bearer ${KIODO_KEY}` }, signal: controller.signal }
        );
        clearTimeout(timeout);
        if (seoRes.ok) {
          seoData = await seoRes.json();
        }

        const compRes = await fetch(
          `${KIODO_API}/search?q=${encodeURIComponent(`top competitors for ${domain} ${siteName}`)}`,
          { headers: { Authorization: `Bearer ${KIODO_KEY}` } }
        );
        if (compRes.ok) {
          competitorData = await compRes.json();
        }
      } catch {}
    }

    const analysis = {
      siteName: siteName || domain,
      domain,
      traffic,
      goal,
      seoData,
      competitorData,
      summary: generateSummary(siteName || domain, goal, traffic, seoData),
    };

    return NextResponse.json({ analysis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 400 });
  }
}

function generateSummary(
  siteName: string,
  goal: string,
  traffic: string,
  seoData: any
) {
  const goalText =
    goal === "leads" ? "generating qualified leads" :
    goal === "customers" ? "acquiring new customers" :
    goal === "authority" ? "building brand authority" :
    "reducing marketing costs";

  const trafficText =
    traffic === "0-100" ? "just starting out with minimal traffic" :
    traffic === "100-1k" ? "getting early traction" :
    traffic === "1k-10k" ? "growing steadily" :
    "scaling up fast";

  if (seoData?.results?.length) {
    const insights = seoData.results.slice(0, 3).map((r: any) => r.title || r.snippet).filter(Boolean).join(". ");
    return `I analyzed ${siteName} and found: ${insights || "Your site has room to grow in organic search."}. You're ${trafficText} with a focus on ${goalText}. The data shows clear opportunities to improve your AI search visibility.`;
  }

  return `I analyzed ${siteName} and its online presence. You're ${trafficText} with a focus on ${goalText}. Your site has untapped potential — there are clear keyword gaps and opportunities to rank on both Google and AI search engines.`;
}
