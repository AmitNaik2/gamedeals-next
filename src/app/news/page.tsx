import type { Metadata } from "next";
import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = "https://www.gamesdealshub.me";
const ogImage = `/og?${new URLSearchParams({
  title: "PC Gaming Deal News",
  platform: "News",
  expiry: "Updated weekly",
}).toString()}`;

export const metadata: Metadata = {
  title: "Free PC Game News June 2026 | Epic, Steam & Giveaway Tracking",
  description:
    "Original GamesDealsHub news on June 2026 free PC games, Epic Games giveaway history, Steam drops, and tracking across 9+ platforms.",
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
    title: "Free PC Game News | GamesDealsHub",
    description: "June 2026 free game news, Epic giveaway history, and how GamesDealsHub tracks active drops.",
    url: `${siteUrl}/news`,
    siteName: "GamesDealsHub",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "GamesDealsHub News" }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PC Game News | GamesDealsHub",
    description: "Free game news, Epic history, and tracking notes from GamesDealsHub.",
    images: [ogImage],
  },
};

const articles = [
  {
    title: "Best Free PC Games of June 2026 — Every Active Giveaway Right Now",
    label: "June 2026 Giveaway Watch",
    body: [
      "June 2026 is a strong month for free PC game hunters because the active giveaway list has a healthy mix of bigger storefront promotions, short Steam campaigns, and smaller indie drops that are easy to miss if you only check one launcher. At the time of this update, the live feed includes strategy, survival, horror, racing, puzzle, and DRM-free indie titles. That variety is exactly why GamesDealsHub sorts by expiry and platform instead of simply showing the newest post first. A game ending tonight deserves attention before a newer offer that lasts several more days.",
      "The headline Epic Games free picks this week are Warhammer 40,000: Speed Freeks and The Ouroboros King. Speed Freeks is the loud, aggressive choice: a vehicle combat game built around fast movement, heavy weapons, and the exaggerated scale of the Warhammer universe. It is the kind of free claim that makes sense even if you only plan to test it later, because multiplayer titles benefit from big spikes of new players during giveaway windows. The Ouroboros King is quieter but just as interesting for strategy players. Its chess-inspired tactics and roguelike structure make it a good fit for anyone who wants a thoughtful turn-based game rather than another shooter.",
      "Steam is also carrying several active giveaways in June 2026. Wild Terra 2: New Lands is the highest-value Steam listing in the current batch, with a survival MMO structure, crafting, settlement building, and a slower pace than most action-heavy free drops. Eets is an older puzzle game with a bright, experimental personality, and Happy's Humble Burger Farm brings a strange horror-comedy angle for players who enjoy unsettling shop-floor management. The Red Lantern is another Steam highlight, offering a narrative survival journey through the Alaskan wilderness with dogsled travel, resource decisions, and a calmer but tense atmosphere. These Steam campaigns are important because their windows can be short, sometimes ending before casual users notice them.",
      "Hidden gems are where smaller storefronts matter. Itch.io and IndieGala do not always generate the same social buzz as Epic or Steam, but they regularly surface small projects that are worth claiming for curiosity alone. Not A Customer, currently listed through itch.io, is a good example of a tiny DRM-free game that would be invisible in a mainstream storefront roundup. These games may not have huge budgets, but they are often quick to download, easy to archive, and useful for players who enjoy experimental design. If you are building a varied PC library, do not skip the indie section just because the original price is lower.",
      "Deal length is the detail that matters most this month. Several Steam offers are scheduled to end around June 15, 2026, while some Epic and mobile-adjacent listings run closer to June 18, 2026. Indie offers can end even sooner. Treat every expiry date as a deadline, not a suggestion. Store pages can change early, key pools can run out, and regional availability sometimes shifts without much notice. The safest routine is to claim the game when you see it, confirm it appears in your library, and then decide later whether it deserves an install.",
      "The best free PC games of June 2026 are not all the same kind of recommendation. Speed Freeks is for multiplayer chaos, The Ouroboros King is for tactical thinking, Wild Terra 2 is for survival crafting, The Red Lantern is for story-focused exploration, Eets is for puzzle fans, and smaller Itch.io drops are for discovery. That is the value of a central feed: you can scan everything, sort by expiry, and claim the titles that match your taste before the window closes.",
      "If you want the fastest path, start on the GamesDealsHub homepage, sort the active giveaway list by expiry, and claim the offers marked as ending soon first. Then come back for the Epic and Steam picks with longer windows. We update the feed regularly so you can spend less time chasing store pages and more time building a library you will actually play.",
    ],
  },
  {
    title: "Epic Games Free Game History — Every Game Given Away Since 2018",
    label: "Epic Games Archive",
    body: [
      "Epic Games changed the rhythm of PC game collecting when it turned free weekly games into a regular habit. The program began in 2018 as a way to bring players into the Epic Games Store, but over time it became one of the most recognizable giveaway systems in gaming. The basic rule is simple: during a limited claim window, users can add selected games to their Epic account for free and keep them permanently. Once claimed, the game stays in the library even after the promotion ends. That permanent ownership model is why deal hunters still pay close attention every Thursday.",
      "The free program usually works on a weekly cadence. Epic reveals one or more current free games, shows the next scheduled title when it is not a mystery campaign, and then refreshes the lineup at the next weekly changeover. During seasonal events, especially holiday promotions, the schedule can become more aggressive with daily mystery games. This pattern trains users to check regularly, but it also creates a common problem: people remember hearing about a free game after the claim window has already closed. That is why expiry-aware tracking matters.",
      "The history of notable Epic freebies is long. Early years helped establish trust with recognizable indie hits and premium PC titles. Over time, the store gave away games across almost every major category: open-world action, strategy, management, roguelikes, narrative adventures, shooters, horror, puzzle games, and family-friendly releases. The biggest moments came when Epic offered major mainstream titles that normally sat near the top of wishlists. Those headline giveaways turned the program from a quiet promotion into a weekly news event.",
      "Some of the most popular Epic giveaways became famous because they were easy recommendations even for players outside the usual deal-hunting crowd. Big-budget open-world games, beloved indies, well-reviewed strategy titles, and multiplayer releases tend to create the strongest response. A free claim is especially powerful when a game has DLC, sequels, or a live community, because new players can enter the ecosystem without paying upfront. From Epic's perspective, that creates engagement. From the player's perspective, it creates a legitimate library upgrade.",
      "The most important claiming tip is to treat every Epic promotion as time-sensitive. Do not wait until the weekend if you already know you want the game. Open the official Epic Games Store page, sign in, click Get, complete the zero-dollar checkout, and confirm that the title appears in your library. If a mystery game is revealed during a holiday campaign, claim it the same day. Daily windows are easy to miss, and social posts often reach people after the useful claim period has passed.",
      "Another useful habit is separating claim decisions from install decisions. You do not need to download a game immediately to keep it. Claim first, then install later when you have time and storage space. This is especially helpful during holiday runs when several games arrive in a row. Keep a simple backlog list or tag claimed Epic games by genre so you can find them later. Otherwise, a strong free library can become a messy collection you forget to use.",
      "What should players expect next from Epic? The overall pattern is likely to continue: weekly giveaways, seasonal spikes, publisher partnerships, and occasional surprise headliners. As the PC storefront market stays competitive, free games remain a direct way to bring users back into the store. We also expect more campaigns tied to sequels, DLC launches, major updates, and franchise anniversaries. That means the best future Epic freebies may not always be random; they may arrive when a publisher wants attention on a related release.",
      "For GamesDealsHub readers, the practical takeaway is simple. Epic Games has built one of the most valuable free-game programs in PC gaming, but the value only exists if you claim before expiry. Use the active feed, watch the weekly changeover, and treat every free Epic listing as a short appointment with your future library.",
    ],
  },
  {
    title: "GamesDealsHub — How We Track Free Games Across 9+ Platforms",
    label: "Behind The Tracker",
    body: [
      "GamesDealsHub exists because free PC games are scattered. A normal week can include Epic Games Store giveaways, Steam 100% off promotions, GOG sale bonuses, Prime Gaming keys, Ubisoft Connect rewards, IndieGala promos, itch.io projects, Stove drops, Meta offers, and smaller publisher campaigns. Each platform has its own timing, wording, and claim process. Our mission is to turn that scattered information into one practical dashboard where players can answer three questions quickly: what is free, where can I claim it, and how long do I have left?",
      "The story behind the site is simple. We are gamers who got tired of missing good giveaways because the announcement lived in the wrong launcher, a social post arrived late, or a store page quietly changed before we checked it. Free games should feel fun, not like homework. GamesDealsHub was built to reduce that friction. Instead of asking players to refresh every storefront manually, we collect active offers, normalize their dates, label platforms clearly, and push urgent deals higher in the experience.",
      "Our tracking system starts with public deal feeds, official store signals, and platform-specific checks where available. We look for offers that are actually useful to players: paid games temporarily discounted to free, free-to-keep campaigns, limited key giveaways, and official promotions from known sources. We avoid presenting expired offers as active deals. When a listing has an end date, we compare it against the current UTC time, remove expired deals from active pages, and surface urgency badges for offers that are close to ending. This is one of the most important trust features on the site.",
      "The platforms we monitor include Steam, Epic Games Store, GOG, Prime Gaming, Ubisoft Connect, IndieGala, itch.io, Stove, and Meta, with additional publisher or campaign pages reviewed when they appear. Not every platform behaves the same way. Steam promotions can be short and quiet. Epic usually follows a weekly rhythm. GOG often connects giveaways to seasonal sales. Prime Gaming may require a second redemption step. Itch.io can host tiny DRM-free projects that never reach mainstream deal pages. A good tracker has to respect those differences rather than flattening every offer into the same label.",
      "Update frequency matters because free game data ages quickly. We refresh active feeds regularly, cache API responses responsibly, and show users when the feed was last updated. If a game is ending soon, it should be visible before a less urgent item. If a store provides no reliable expiry date, we keep that uncertainty visible instead of inventing a deadline. The goal is not to look bigger than we are; the goal is to be useful and honest enough that players come back when a claim window matters.",
      "Using GamesDealsHub effectively is straightforward. Start on the homepage and scan the active game list. Sort by expiry if you only have a few minutes. Claim anything marked as ending today before browsing by genre or platform. Open the official claim page, complete the zero-dollar checkout or key redemption, and confirm the game appears in your library. After that, use the guides and reviews sections to decide what is worth installing, wishlisting, or saving for later.",
      "We also write supporting content because AdSense-ready and user-ready are the same direction for us: real pages, clear policies, helpful explanations, and human context around the deals. A bare feed can tell you that a game is free. A stronger site explains whether the giveaway is legitimate, how the claim works, why the expiry matters, and what kind of player might enjoy it.",
      "GamesDealsHub is not trying to replace the stores. It is a companion for players who want a cleaner way to follow them. We link users to official claim paths, respect privacy requirements, and keep improving the tracker around the habits real deal hunters use every week. If that saves you from missing one great free game, the site has done its job.",
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
    name: "GamesDealsHub Free Game News",
    description: "Original news articles about free PC games, Epic Games giveaways, and GamesDealsHub tracking methods.",
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
