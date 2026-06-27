import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function companyFor(userId: string, email: string, name: string, websiteUrl: string) {
  return {
    id: `tenant_${randomUUID()}`,
    userId,
    name: name || "My Workspace",
    websiteUrl: websiteUrl || "xase.ai",
    industry: "Technology",
    language: "English",
    discoverySource: "Landing Page",
    description: "",
    timezone: "UTC+00:00 London",
    onboardingCompleted: false,
    onboardingStep: 1,
    onboardingGoal: "",
    onboardingAnalysisJson: "{}",
    onboardingFunnelJson: "{}",
    leadStatus: "active",
    seoScore: 0,
    articlesInQueue: 0,
    audiences: [] as { id: string; name: string }[],
    competitors: [] as { id: string; domain: string }[],
    notifications: [
      { id: "n_email", key: "email", label: "Email", help: "", enabled: true },
      { id: "n_keyword", key: "keyword", label: "Keyword Ranking", help: "", enabled: true },
      { id: "n_weekly", key: "weekly", label: "Weekly Reports", help: "", enabled: true },
      { id: "n_billing", key: "billing", label: "Billing", help: "", enabled: true },
    ],
    automation: null,
    integrations: [] as any[],
    contentItems: [] as any[],
    keywords: [] as any[],
    analyticsSnapshots: [
      {
        id: "snap_30d",
        period: "30d",
        visitors: 0,
        visitorsDelta: 0,
        avgPosition: 0,
        positionDelta: 0,
        keywordsRanking: 0,
        articlesPublished: 0,
      },
    ],
    chatMessages: [] as any[],
  };
}

const SESSION_COOKIE = "gedi_session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    const name = String(body.name || email.split("@")[0] || "").trim();
    const websiteUrl = String(body.websiteUrl || "").trim();

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        role: "USER",
        password: hash(password),
      },
    });

    const company = companyFor(user.id, email, name, websiteUrl || "xase.ai");
    const subscription = { id: `sub_${randomUUID()}`, companyId: company.id, status: "free" };

    await prisma.appState.create({
      data: {
        userId: user.id,
        company: company as any,
        subscription: subscription as any,
      },
    });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.create({
      data: { token, userId: user.id, expiresAt },
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: (user.name || email).split(/\s+/).filter(Boolean).slice(0, 2).map((p: string) => p[0]?.toUpperCase()).join("") || "U",
        role: "user",
      },
      company,
      subscription,
    });

    response.headers.set(
      "Set-Cookie",
      `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 400 });
  }
}
