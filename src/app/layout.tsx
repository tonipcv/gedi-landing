import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://gedi.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Gedi — Rank #1 in AI Search | ChatGPT, Perplexity & Google SEO",
    template: "%s | Gedi",
  },
  description:
    "AI-powered SEO co-pilot that optimizes your content for ChatGPT, Perplexity, Gemini, and Google. Get your brand cited as the #1 source in AI search results. Start free — no credit card.",
  keywords: [
    "AI SEO",
    "ChatGPT SEO",
    "AI search ranking",
    "Perplexity optimization",
    "Gemini SEO",
    "AI content optimization",
    "LLM search ranking",
    "generative engine optimization",
    "GEO",
    "AI-powered SEO tool",
  ],
  authors: [{ name: "Gedi" }],
  creator: "Gedi",
  publisher: "Gedi",
  icons: { icon: "/favicon.ico" },
  formatDetection: { telephone: false },
  alternates: {
    canonical: BASE_URL,
    languages: { "en-US": BASE_URL },
  },
  openGraph: {
    title: "Gedi — Rank #1 in AI Search | ChatGPT, Perplexity & Google SEO",
    description:
      "AI-powered SEO co-pilot that puts your brand at the top of AI search results. Rank in ChatGPT, Perplexity, and Google. Start free.",
    url: BASE_URL,
    siteName: "Gedi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gedi — Rank #1 in AI Search | ChatGPT, Perplexity & Google SEO",
    description:
      "AI-powered SEO co-pilot that puts your brand at the top of AI search results. Start free.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Gedi",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "AI-powered SEO co-pilot that optimizes your content for ChatGPT, Perplexity, Gemini, and Google. Get your brand cited as the #1 source in AI search results.",
              url: BASE_URL,
              offers: {
                "@type": "Offer",
                price: "19",
                priceCurrency: "USD",
                description: "Monthly subscription",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "247",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
