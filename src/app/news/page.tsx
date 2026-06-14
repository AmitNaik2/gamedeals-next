import type { Metadata } from "next";
import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = "https://www.gamesdealshub.me";

export const metadata: Metadata = {
  title: "PC Gaming Deal News | Free Games, Storefront Updates & Giveaway Trends",
  description:
    "GamesDealsHub news coverage on free PC game trends, storefront giveaway strategy, Steam discounts, Epic drops, and deal-hunting updates.",
  keywords: [
    "PC gaming news",
    "free games news",
    "Epic Games free games news",
    "Steam deals news",
    "game giveaway trends",
    "GamesDealsHub news",
  ],
  alternates: { canonical: `${siteUrl}/news` },
  openGraph: {
    title: "PC Gaming Deal News | GamesDealsHub",
    description: "News and analysis for free PC game drops, storefront promotions, and deal-tracking trends.",
    url: `${siteUrl}/news`,
    siteName: "GamesDealsHub",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "GamesDealsHub News" }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PC Gaming Deal News | GamesDealsHub",
    description: "Free game news, storefront trends, and deal tracking analysis.",
    images: ["/og-image.jpg"],
  },
};

const articles = [
  {
    title: "Why Free-to-Keep PC Games Became a Storefront Growth Strategy",
    label: "Market Watch",
    body: [
      "Free-to-keep PC game campaigns are no longer random acts of generosity. They have become a repeatable growth strategy for storefronts, publishers, and independent studios trying to earn attention in an overcrowded market. A player may ignore a banner for a 20% discount, but a zero-dollar checkout still creates urgency. Once a game is permanently added to a library, the store wins a login, the publisher wins brand awareness, and the player gains a low-risk reason to explore a catalog they might have skipped.",
      "Epic Games popularized the predictable weekly giveaway model, but the idea now appears across the wider PC ecosystem. Steam developers use 100% off events to revive older titles or introduce players to a series before a sequel launches. GOG uses giveaways during seasonal sales to pull users into DRM-free bundles. Prime Gaming turns monthly offers into a membership benefit. Even smaller publisher launchers use free drops to encourage account creation. The common thread is attention. A free game gives users a reason to open a store, review a wishlist, and consider related paid content.",
      "This trend benefits players, but it also increases the need for better filtering. As more storefronts compete with giveaways, the word free becomes less precise. Some offers are free-to-play titles, some are demos, some are DLC packs, some are time-limited trials, and some are true paid games that become free to keep. GamesDealsHub focuses on that distinction because users need to know whether clicking claim creates lasting ownership. The difference matters for SEO, user trust, and basic usefulness. A feed full of permanent free-to-play games is not the same as a feed of expiring premium giveaways.",
      "Publishers also gain long-tail value after the promotion ends. A player who claims the first game in a franchise may wishlist the sequel, buy DLC, recommend the title to friends, or return when a remaster launches. That makes free campaigns closer to audience acquisition than discounting. The store absorbs attention costs, the publisher gets a burst of visibility, and the player gets a permanent sample of the catalog. When the match is good, everyone wins.",
      "The risk is saturation. If every store runs constant giveaways without clear quality signals, users may become numb to free offers. That is why curation, expiry badges, platform labels, and review context matter. The next competitive advantage will not be simply having more listings. It will be helping players decide which listings are legitimate, urgent, and worth a permanent library slot.",
      "The next phase of deal discovery will likely be more personalized. Storefronts already know wishlists, play history, preferred genres, and regional pricing. The best user-facing trackers will combine that data with independent verification, expiry sorting, and clear badges. Instead of asking players to monitor every launcher, a tracker can show which offers are active, which are urgent, and which are likely worth claiming based on genre or review signals. Free games are now part of the PC gaming economy, and players who understand the strategy can collect more value without wasting time.",
    ],
  },
  {
    title: "Expiry Windows Are Becoming the Most Important Signal in Deal Discovery",
    label: "Deal Intelligence",
    body: [
      "For years, deal pages were organized around discount size, popularity, or publication date. That made sense when most users were shopping for paid discounts. Free game tracking has a different priority: expiry. A 100% off game with six hours remaining is more important than a newer promotion that lasts another week. Missing the short window means losing the game entirely, while claiming early costs nothing. This is why modern giveaway feeds need to sort by urgency instead of simply showing the newest item at the top.",
      "Expiry handling is harder than it looks. Stores may publish local times, UTC timestamps, vague end dates, or campaign pages that change before API data is updated. A deal can also be active in one region and expired in another. The safest public interface is to normalize all known end dates to a consistent time standard, hide expired offers automatically, and flag deals that end today or soon. That gives users a practical action order. They do not need to parse timestamps; they just need to know what to claim first.",
      "The shift toward expiry-first design also improves trust. Users quickly lose confidence when they click an attractive free game and land on a store page where the price has already returned to normal. Expired offers can still be useful in an archive, but they should not be mixed into the active claim feed. Separating active deals from historical records keeps the main experience fast and honest. It also helps search engines understand which pages represent live opportunities and which pages are informational archives.",
      "Expiry signals are also useful for editorial planning. A weekly guide can afford to explain a long-running campaign, but a flash giveaway needs a direct alert and a short path to claim. Treating both formats the same creates friction. Users looking at an urgent offer do not want a long essay before the store link; users reading an archive do want context, history, and alternatives. Good deal pages should match the content depth to the remaining claim window.",
      "There is a technical side as well. API feeds can lag, store pages can cache old prices, and regional availability can change during a campaign. A tracker should update timestamps honestly so users know when the last fetch happened. If the data is stale, users deserve to know. Accurate timestamps, automatic hiding of expired deals, and visible expiry badges are simple features, but they prevent a lot of bad clicks.",
      "GamesDealsHub treats expiry as a core content signal because it reflects real user intent. Deal hunters are not only browsing; they are trying to avoid missing out. The most useful page answers three questions immediately: what is free, where can I claim it, and how long do I have left? As stores continue to experiment with flash promotions, daily events, and rotating mystery games, expiry-aware tracking will become even more important. The future of deal discovery is not just bigger feeds. It is smarter ordering.",
    ],
  },
  {
    title: "The Rise of Multi-Launcher Libraries and What It Means for PC Players",
    label: "Platform Trends",
    body: [
      "PC gaming used to revolve around one dominant library for many players. That is no longer the reality. A modern collection can be split across Steam, Epic Games Store, GOG, Prime Gaming, Ubisoft Connect, EA App, Battle.net, itch.io, and publisher-specific launchers. Free game promotions accelerated that fragmentation because players are willing to create or reopen accounts when the reward is permanent ownership. Over time, a user who started with one launcher can end up with hundreds of games scattered across multiple ecosystems.",
      "This fragmentation has tradeoffs. On the positive side, competition creates value. Storefronts use free games, coupons, loyalty programs, and bundles to win attention. Players who follow those promotions can build impressive libraries without spending much. On the negative side, discovery becomes messy. You may forget where you own a game, miss a DLC claim because it belongs to another launcher, or buy a title on sale without realizing you already claimed it elsewhere. A free game is only useful if you can find it again later.",
      "Library tools are improving, but the problem is not fully solved. GOG Galaxy can connect several platforms, Steam collections help inside Steam, and launcher search has become better, but many users still need their own organization habits. Deal hunters should track platform ownership, redemption status, and claim date. This is especially important for Prime Gaming and key-based giveaways, where claiming an offer page may not complete the final store redemption. The extra record keeping prevents wasted keys and duplicate purchases.",
      "The Steam Deck and handheld PC market adds another wrinkle. A game claimed on Epic or GOG may still be playable on a handheld, but it can require extra launcher setup compared with a Steam copy. That does not make non-Steam claims bad, but it changes the value calculation for some players. A duplicate claim on Steam may be more convenient, while a GOG copy may be better for DRM-free archiving. Platform context now matters almost as much as price.",
      "For families and shared gaming spaces, multi-launcher libraries can also create account confusion. A child might remember owning a game without knowing which parent account claimed it. A living-room PC might have several launchers installed but only one logged in. Keeping a simple ownership record reduces that friction. It also helps when reinstalling Windows or moving to a new machine, because you know exactly which launchers need to be restored.",
      "For content sites and trackers, the multi-launcher era changes what users expect. A good deal page should identify the storefront clearly, link to the official claim path, show expiry, and explain whether the offer is a game, DLC, cosmetic, trial, or key redemption. Generic free game lists are not enough anymore. Players need context because every launcher has slightly different rules. GamesDealsHub is built around that reality: one dashboard, many storefronts, and enough structured information to turn scattered promotions into a manageable routine.",
    ],
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GamesDealsHub",
    url: siteUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "GamesDealsHub Deal News",
    description: "News and analysis for free PC game giveaways and storefront deal trends.",
    brand: { "@type": "Brand", name: "GamesDealsHub" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why do PC stores give away paid games?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Giveaways attract logins, build goodwill, promote sequels, revive communities, and introduce players to related paid content.",
        },
      },
      {
        "@type": "Question",
        name: "Why does expiry matter for free game news?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Expiry determines whether a user can still claim permanent ownership, so urgent offers should be shown before long-running promotions.",
        },
      },
    ],
  },
];

export default function NewsPage() {
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || "#";

  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <main className="min-h-screen px-4 py-24 md:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#06B6D4]">PC Gaming News</span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              Deal Tracking Dispatch
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#9CA3AF]">
              News and analysis on free game campaigns, storefront behavior, expiry windows, and the changing shape of PC libraries.
            </p>
          </header>

          <div className="space-y-10">
            {articles.map((article) => (
              <article key={article.title} className="rounded-2xl border border-white/10 bg-[#0F172A]/80 p-6 md:p-10">
                <p className="text-[10px] font-orbitron font-bold uppercase tracking-widest text-[#8B5CF6]">
                  {article.label}
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-white">{article.title}</h2>
                <div className="mt-7 space-y-5 font-poppins text-[15px] leading-8 text-[#D1D5DB]">
                  {article.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 70)}>{paragraph}</p>
                  ))}
                </div>
                <AuthorBox />
              </article>
            ))}
          </div>

          <section className="mt-12 rounded-2xl border border-white/10 bg-[#050816] p-6 text-center">
            <h2 className="text-xl font-bold text-white">Join The Community</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#9CA3AF]">
              Get alerts, compare notes with other deal hunters, and follow the next wave of free PC game drops.
            </p>
            <Link
              href={discordUrl}
              className="mt-5 inline-block rounded-lg bg-[#8B5CF6] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#7C3AED]"
            >
              Join Discord
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
