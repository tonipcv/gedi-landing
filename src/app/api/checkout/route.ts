import { NextResponse } from "next/server";

const STRIPE_API = "https://api.stripe.com/v1";

function secretKey() {
  return process.env.STRIPE_SECRET_KEY || "";
}

async function stripePost<T>(path: string, data: Record<string, string | number | boolean | null | undefined>): Promise<T> {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) params.set(key, String(value));
  });

  const response = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error?.message || `Stripe request failed: ${response.status}`);
  }
  return body as T;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const websiteUrl = String(body.websiteUrl || "").trim();
    const leadId = String(body.leadId || "");
    const goal = String(body.goal || "");
    const traffic = String(body.traffic || "");
    const plan = String(body.plan || "monthly");
    const siteName = String(body.siteName || "");

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_STARTER || "starter_monthly";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dash.gedi.dev";

    if (!secretKey().startsWith("sk_")) {
      return NextResponse.json({
        url: `${appUrl}/signup?email=${encodeURIComponent(email)}&websiteUrl=${encodeURIComponent(websiteUrl)}&leadId=${leadId}&goal=${encodeURIComponent(goal)}&traffic=${encodeURIComponent(traffic)}&plan=${plan}&source=landing_onboarding`,
      });
    }

    const session = await stripePost<{ id: string; url: string }>("/checkout/sessions", {
      mode: "subscription",
      "customer_email": email,
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": 22800,
      "line_items[0][price_data][recurring][interval]": "year",
      "line_items[0][price_data][product_data][name]": "Gedi Business — Annual Plan",
      "line_items[0][quantity]": 1,
      success_url: `${appUrl}/pricing?checkout=success`,
      cancel_url: appUrl,
      "metadata[source]": "landing_checkout",
      "metadata[leadId]": leadId,
      "metadata[email]": email,
      "metadata[websiteUrl]": websiteUrl,
      "metadata[goal]": goal,
      "metadata[traffic]": traffic,
      "metadata[plan]": plan,
      "metadata[siteName]": siteName,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 400 });
  }
}
