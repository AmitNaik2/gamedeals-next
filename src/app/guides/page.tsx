import type { Metadata } from "next";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = "https://www.gamesdealshub.me";

export const metadata: Metadata = {
  title: "Free PC Game Guides | Epic, Steam, GOG & Deal Tracking",
  description:
    "Detailed GamesDealsHub guides for claiming free PC games, tracking Steam and Epic giveaways, avoiding expired offers, and building a verified game library.",
  keywords: [
    "free PC game guides",
    "how to claim free games",
    "Epic Games free games guide",
    "Steam 100% off games",
    "GOG free games",
    "PC game giveaway tips",
    "GamesDealsHub guides",
  ],
  alternates: { canonical: `${siteUrl}/guides` },
  openGraph: {
    title: "Free PC Game Guides | GamesDealsHub",
    description:
      "Step-by-step guides for claiming free games, tracking giveaway windows, and building a PC library across Epic, Steam, GOG, and more.",
    url: `${siteUrl}/guides`,
    siteName: "GamesDealsHub",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "GamesDealsHub Guides" }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PC Game Guides | GamesDealsHub",
    description: "Claim free PC games safely and never miss a giveaway window.",
    images: ["/og-image.jpg"],
  },
};

const guides = [
  {
    title: "How to Claim Free PC Games Without Missing the Expiry Window",
    deck: "A practical workflow for finding, verifying, claiming, and organizing limited-time free game offers.",
    paragraphs: [
      "Claiming free PC games sounds simple until you start following more than one storefront. Epic Games has predictable weekly drops, Steam promotions can appear with almost no warning, GOG often runs seasonal campaigns, Prime Gaming rotates monthly, and publisher launchers may hide limited offers inside news posts. The most common mistake is treating every free game like it will stay available forever. Most real giveaways are timed campaigns, and the difference between adding a title permanently to your library and missing it completely can be a few hours. A reliable claiming routine starts with checking the active deal feed, sorting by expiry, and handling the nearest deadline first. GamesDealsHub is designed around that order because an attractive new drop is not always the most urgent one.",
      "The first step is verification. Before you click through to a store, confirm that the listing is a paid game currently discounted to free, not a permanently free-to-play title, a demo, a trial weekend, or a cosmetic pack. A legitimate free-to-keep deal should show a 100% discount, a zero checkout total, or a clear add-to-library button on the official storefront. If the offer requires a third-party key, be more cautious. Use well-known stores such as Humble Bundle, Fanatical, Alienware Arena, or the publisher's own site, and avoid pages that ask for unnecessary personal data. A safe claiming process should never require your Steam password on a non-Steam domain. When in doubt, go to the official store manually and search for the game title instead of trusting a shortened link.",
      "Once the deal is confirmed, claim it immediately. Do not wait until you are ready to install it. Most storefronts separate ownership from download, so you can add the game to your account now and install it later. On Epic, click Get and complete the zero-dollar checkout. On Steam, click Add to Account or Add to Library when a 100% off promotion is active. On GOG, use the giveaway banner or product page while logged in. On Prime Gaming, claim the offer and then redeem any linked store key before the key deadline. After claiming, check your library or transaction history. This extra ten-second confirmation prevents the painful situation where a store page refreshed, the order failed silently, or the browser session expired before the claim was finalized.",
      "Managing expiry windows is where most people lose value. Some giveaways last a week, but flash promotions can vanish in less than a day. Treat expiry time as UTC when possible, because stores and aggregators may display regional dates differently. If a deal says it ends today, claim it before doing anything else. If it is expiring soon, set a reminder for the same day rather than assuming tomorrow will be safe. GamesDealsHub marks urgent offers so you can quickly distinguish between a comfortable weekly drop and a closing window. For users in different time zones, the safest rule is simple: if an offer is worth claiming, claim it during the current session.",
      "A second workflow is library organization. Free game hunters often build huge collections, then forget what they own. Use tags or categories inside your launcher for backlog, co-op, strategy, indie, family, benchmark, or play soon. Steam collections are especially useful, and GOG Galaxy can connect multiple platforms into a unified view. Keep a small monthly play queue so claiming does not turn into digital clutter. You can also record claimed games in a spreadsheet with columns for title, platform, claim date, genre, and whether it has controller support. This sounds excessive, but it helps when you want to find a short co-op game for the weekend or avoid buying a title you already claimed years ago.",
      "It is also worth understanding regional and account limitations before you build a routine. Some offers are available only in selected countries, some require age verification, and some publisher campaigns need a linked account before the store will finalize the claim. If a deal fails, do not assume the tracker is wrong. Open the official page in a fresh browser session, check whether you are logged into the correct region, and look for notes about platform restrictions. For key-based giveaways, redeem the code as soon as possible because keys can run out even before the advertised campaign end date.",
      "Parents and shared-household players should add one more step: account separation. Claiming games on the wrong Epic, Steam, or GOG account is easy when several people use the same browser. Before completing a zero-dollar checkout, confirm the username in the store header. If you manage a child's library, use family settings and avoid third-party giveaway tasks that require social accounts. A free game routine should be safe enough to repeat every week without exposing personal accounts, payment details, or family profiles to unnecessary risk.",
      "Finally, treat missed deals as information rather than failure. If you missed a title because the alert arrived too late, add that storefront to your routine. If you missed it because you ignored an expiry badge, adjust your claim order. If you skipped it intentionally, that is a valid decision too. The goal is not to own every possible game; the goal is to build a useful library while spending less money and less time.",
      "The final habit is building a dependable alert stack. Bookmark GamesDealsHub, subscribe to email alerts, check Thursday Epic updates, and watch for seasonal events such as summer sales, holiday giveaways, publisher anniversaries, and major game showcases. Do not rely on social feeds alone, because algorithms often show posts after the useful claim window has closed. A good alert system should have one fast channel for urgent drops and one slower channel for weekly summaries. With those habits in place, free game hunting becomes low effort: verify the offer, claim before expiry, confirm ownership, organize the library, and move on. That process protects your time while steadily growing a legitimate PC game collection.",
    ],
  },
  {
    title: "Steam 100% Off Promotions: How to Separate Real Giveaways from Noise",
    deck: "Steam offers huge value, but its best free-to-keep promotions are scattered, short-lived, and easy to confuse with free-to-play games.",
    paragraphs: [
      "Steam is the largest PC game storefront, which makes it both powerful and noisy. Thousands of free-to-play games, demos, prologues, playtests, weekend trials, and discounted bundles appear beside genuine paid games that temporarily drop to 100% off. For deal hunters, the goal is not to install every free thing on Steam. The goal is to identify paid products that become free to keep, claim them while the promotion is active, and ignore listings that do not add lasting value to your account. That distinction matters because Steam's discovery pages are not built specifically for giveaway tracking. A game can be free for two days and still be buried below popular free-to-play titles or unrelated sale banners.",
      "A real Steam free-to-keep deal usually has three signs. First, the original price is visible or recently visible. Second, the current promotional price is zero. Third, the store button adds the game to your account permanently rather than launching a temporary trial. Some promotions show a 100% discount badge, while others simply say Add to Account. Trial weekends are different: they may say Play Game and disappear from your playable library after the event. Demos and prologues are also different products, even when they use the same name as a paid release. If you are unsure, read the right side of the Steam page, check recent announcements, and look for phrases such as free to keep, add to your library, or limited-time giveaway.",
      "Developers run Steam giveaways for several reasons. A studio may promote a sequel, revive interest in older DLC, celebrate an anniversary, create wishlists for a new project, or draw players back into a multiplayer community. These campaigns are often successful because Steam users are willing to try unknown games when the cost barrier is removed. That is good for players, but it also means giveaways can happen at odd times. Unlike Epic's weekly rhythm, Steam drops can begin on a Monday morning, during a festival, after a publisher showcase, or alongside a patch. Automated monitoring is valuable because manual browsing misses promotions that are not featured on the front page.",
      "When you claim a Steam promotion, use the official store page whenever possible. Log in, press Add to Account, and wait for the confirmation message. If a third-party site is distributing Steam keys, redeem the key in the Steam client through Games, Activate a Product on Steam. Never enter Steam credentials into a third-party giveaway site. If a site asks you to connect your Steam account, understand what permissions it requests and whether the brand is trustworthy. Some legitimate community promotions use OAuth sign-in, but the safest habit is to redeem a key directly inside Steam rather than sharing account access with unfamiliar pages.",
      "Sorting by expiry is especially important on Steam because giveaway windows vary wildly. Some indie promotions run for a week, while others are visible for only twenty-four hours. A large discount event can also create confusion: a game listed as free today might revert to paid before the overall seasonal sale ends. That is why GamesDealsHub treats expiry as a first-class signal and pushes soon-ending deals higher in the feed. If you maintain your own watchlist, sort by end date rather than by popularity. Popularity tells you what other people are clicking; expiry tells you what you must act on now.",
      "Reviews are another useful filter, but they need context. A mixed Steam score does not always mean a free claim is worthless. Sometimes a game was review-bombed for launch bugs that have since been fixed, or a niche title has a small audience that judges it harshly. Read recent reviews, check whether the developer is still updating the game, and look at playtime patterns. If many reviewers played for ten or twenty hours before leaving criticism, the game may still be worth adding to your library. For a zero-cost claim, the question is not whether the game is perfect; it is whether it has enough potential value to justify one click.",
      "Steam bundles and DLC can complicate the decision. A base game might be free while expansions remain paid, or a giveaway might include only a starter edition. Before assuming you received the complete package, review the package details and library entry. If the giveaway is tied to a multiplayer game, check whether the player base is active in your region. If it is a single-player title, confirm whether it supports cloud saves and controllers if those features matter to you. Small checks like these help you decide whether to install immediately, tag for later, or simply keep the license as a future option.",
      "Wishlist discipline makes Steam tracking even stronger. Add games you genuinely want, then watch for moments when those wishlisted titles overlap with deep discounts, bundles, or free weekends. A free weekend is not ownership, but it can help you test performance and decide whether a later sale is worthwhile. Combine wishlist alerts with a free-game tracker and you get both sides of the value equation: permanent zero-cost claims and smarter paid purchases.",
      "The best Steam strategy is a combination of automation and restraint. Let a tracker surface real 100% off promotions, but do not claim blindly if the product is clearly irrelevant to you. Read tags, screenshots, and recent reviews. A small horror game, a niche simulator, or an old strategy title may still be worth adding because it costs nothing and can surprise you later. At the same time, avoid clutter from shovelware if you know you will never launch it. The strongest Steam libraries are not just large; they are searchable, tagged, and understood. Claim the real promotions, confirm ownership, organize what you keep, and use your saved money for the games you truly want to support.",
    ],
  },
  {
    title: "Building a Multi-Storefront Free Game Routine Across Epic, GOG, Prime, and More",
    deck: "A repeatable weekly system for tracking every major PC storefront without turning deal hunting into a chore.",
    paragraphs: [
      "The modern PC gaming library is no longer tied to a single launcher. A normal player might own games on Steam, Epic Games Store, GOG, Prime Gaming, Ubisoft Connect, EA App, Battle.net, itch.io, Humble Bundle, and several publisher portals. That fragmentation is annoying when you want to play, but it is useful when you want free games because every storefront has its own promotion calendar. The challenge is building a routine that captures the value without requiring constant manual checks. A good routine has three layers: scheduled weekly checks for predictable stores, automated alerts for surprise drops, and a simple library system that prevents claimed games from vanishing into launcher chaos.",
      "Start with predictable stores. Epic Games Store remains the easiest anchor because it usually refreshes its free game lineup weekly. Make Thursday your claim day, then check both the active free game and the upcoming reveal. GOG often runs giveaways during seasonal sales and publisher events, so it deserves extra attention during major sale periods. Prime Gaming rotates monthly and may include direct downloads, GOG codes, Epic codes, Legacy Games keys, or platform-specific redemption pages. Because Prime rewards can require several separate clicks, always follow the full redemption path until the game is connected to the final library. A claimed Prime offer is not always the same as a redeemed external key.",
      "Next, add alert coverage for surprise stores. Steam, Humble Bundle, Fanatical, Alienware Arena, Ubisoft, EA, and indie publisher sites can publish limited giveaways without much notice. These are the deals most people miss. Use GamesDealsHub as the central dashboard because it consolidates feeds and sorts active drops by urgency. If you also follow social channels, treat them as backup rather than your main source. Social posts can be delayed, deleted, region-specific, or buried by recommendation algorithms. A dedicated tracker is more reliable because it watches price and availability signals directly instead of waiting for a marketing post.",
      "Security matters more as you add stores. Free game hunting attracts scam pages that imitate official giveaways. Use a password manager so fake login pages are easier to spot, enable two-factor authentication on every store, and avoid downloading installers from unknown mirrors. Official giveaways should lead to known storefronts, publisher domains, or reputable key distributors. Be cautious of offers that demand browser extensions, cryptocurrency wallets, executable downloaders, or social tasks that seem unrelated to gaming. A free game is not free if it costs you account access. The safest routine is to claim through official store pages and treat every unfamiliar domain as untrusted until proven otherwise.",
      "Payment hygiene matters too, even when the checkout total is zero. Some storefronts allow free claims without a saved payment method, while others may show a normal cart flow. Avoid adding a card unless the store is official and you actually need it. If a promotion asks for payment details to unlock a free key on an unfamiliar site, walk away. You can also use account notifications so every successful claim sends an email receipt. Those receipts create a searchable backup record and make it easier to notice suspicious account activity quickly.",
      "Cross-platform duplicates are not necessarily bad, but they should be intentional. Owning the same game on Steam and GOG can be useful if you want DRM-free access, cloud saves, mods, or Steam Deck convenience. Owning the same game on three launchers because you forgot previous claims is less useful. When a familiar title appears in a new giveaway, check your tracker before claiming. If the new platform offers a better version, extra DLC, or easier installation, claim it. If not, skip it and keep your library cleaner.",
      "A good routine should also account for installation bandwidth. You do not need to download every claimed game immediately, especially if you have limited storage or a data cap. Claim first, install selectively, and keep a short list of games to test each month. This keeps the process sustainable. Free game collecting becomes frustrating only when every claim turns into a demand on your drive space, attention, and weekend schedule.",
      "The routine should serve your play habits, not the other way around. Claiming is quick; choosing what deserves your evening is the real filter.",
      "Library management is the step that makes multi-storefront collecting sustainable. Choose one place to track ownership. GOG Galaxy can connect several accounts, Steam supports collections, and a simple spreadsheet still works surprisingly well. Record the platform where each game lives because searching every launcher wastes time. Add tags such as co-op, short, controller, strategy, backlog, family, and benchmark. Also record codes that have not been redeemed yet. Prime and bundle keys sometimes expire after the claim page closes, so an unredeemed code sitting in an email inbox is still at risk. A monthly cleanup session prevents those loose ends.",
      "A practical weekly routine can take less than fifteen minutes. On Thursday, check the active GamesDealsHub feed, claim urgent expiring games first, claim Epic's weekly drop, review upcoming drops, redeem any Prime or GOG codes, and add new titles to your library tracker. Once a month, audit launchers for uninstalled games you actually want to play. During big sale seasons, increase checks to daily because giveaways become more frequent. This routine turns fragmented storefronts into an advantage. Instead of chasing every notification, you let a structured system catch the important offers, protect your accounts, and steadily grow a legal PC library across every major ecosystem.",
    ],
  },
];

function pageJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "GamesDealsHub",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "GamesDealsHub Free PC Game Guides",
      description: "Guides for tracking, verifying, and claiming free PC game giveaways.",
      brand: { "@type": "Brand", name: "GamesDealsHub" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I know if a free game is really free to keep?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Look for a zero-dollar checkout, 100% discount, or add-to-library confirmation on the official storefront.",
          },
        },
        {
          "@type": "Question",
          name: "Which free game deals should I claim first?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Claim deals with the nearest expiry first, especially offers marked expiring today or expiring soon.",
          },
        },
      ],
    },
  ];
}

export default function GuidesPage() {
  return (
    <>
      {pageJsonLd().map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <main className="min-h-screen px-4 py-24 md:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 text-center">
            <span className="block text-xs font-bold uppercase tracking-widest text-[#06B6D4]">Gaming Guides</span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              Free PC Game Claiming Playbook
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#9CA3AF]">
              Long-form guides for finding legitimate giveaways, avoiding expired offers, and building a multi-storefront PC game library.
            </p>
          </header>

          <div className="space-y-12">
            {guides.map((guide, index) => (
              <article
                key={guide.title}
                className="rounded-2xl border border-white/10 bg-[#0F172A]/80 p-6 shadow-[0_0_30px_rgba(6,182,212,0.05)] md:p-10"
              >
                <p className="text-[10px] font-orbitron font-bold uppercase tracking-widest text-[#8B5CF6]">
                  Guide {index + 1}
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-white">{guide.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-[#9CA3AF]">{guide.deck}</p>
                <div className="mt-8 space-y-5 font-poppins text-[15px] leading-8 text-[#D1D5DB]">
                  {guide.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 80)}>{paragraph}</p>
                  ))}
                </div>
                <AuthorBox />
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
