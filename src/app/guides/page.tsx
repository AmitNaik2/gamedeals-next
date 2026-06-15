import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { gamingArticles, getArticleWordCount, siteUrl } from "@/lib/articles";

const ogImage = `/og?${new URLSearchParams({
  title: "Free PC Game Guides",
  platform: "Guides",
  expiry: "Batch 1",
}).toString()}`;

export const metadata: Metadata = {
  title: "Free PC Game Guides | GamesDealsHub",
  description:
    "Original beginner-friendly guides for claiming free Epic and Steam games safely, understanding giveaways, and never missing PC deals.",
  keywords: [
    "free PC game guides",
    "Epic Games free games guide",
    "Steam free games guide",
    "free-to-keep games",
    "PC game giveaway tips",
  ],
  alternates: { canonical: `${siteUrl}/guides` },
  openGraph: {
    title: "Free PC Game Guides | GamesDealsHub",
    description:
      "Useful original guides for claiming free PC games safely from official storefronts.",
    url: `${siteUrl}/guides`,
    siteName: "GamesDealsHub",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "GamesDealsHub Guides" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PC Game Guides | GamesDealsHub",
    description: "Claim free PC games safely and understand giveaway types.",
    images: [ogImage],
  },
};

export default function GuidesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GamesDealsHub Free PC Game Guides",
    itemListElement: gamingArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/guides/${article.slug}`,
      name: article.title,
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <main className="min-h-screen px-4 py-24 md:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 text-center">
            <span className="block text-xs font-bold uppercase tracking-widest text-[#06B6D4]">Gaming Guides</span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              Free PC Game Claiming Guides
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#9CA3AF]">
              Original GamesDealsHub guides for claiming free games safely, understanding store wording, and avoiding missed expiry windows.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {gamingArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/guides/${article.slug}`}
                className="group rounded-2xl border border-white/10 bg-[#0F172A]/80 p-6 transition-colors hover:border-[#06B6D4]/50 md:p-8"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#67E8F9]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-orbitron font-bold uppercase tracking-widest text-[#8B5CF6]">
                  {getArticleWordCount(article)} words • Updated June 2026
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-white group-hover:text-[#67E8F9]">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#9CA3AF]">{article.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#06B6D4]">
                  Read guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
