import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gedi — Your Brand in Top 1 When Someone Ask in GPT",
  description: "AI-powered SEO co-pilot that puts your brand at the top of AI search results. Rank in ChatGPT, Perplexity, and Google.",
  openGraph: {
    title: "Gedi — AI SEO Co-Pilot",
    description: "Rank #1 in AI search. ChatGPT, Perplexity, and Google.",
    url: "https://gedi.dev",
    siteName: "Gedi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gedi — AI SEO Co-Pilot",
    description: "Rank #1 in AI search. ChatGPT, Perplexity, and Google.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
