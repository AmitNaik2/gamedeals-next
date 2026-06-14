import type { Metadata } from "next";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = "https://www.gamesdealshub.me";

export const metadata: Metadata = {
  title: "PC Game Reviews | GamesDealsHub Recommendations",
  description:
    "GamesDealsHub reviews of PC games worth watching, claiming, buying on sale, or adding to your backlog across major storefronts.",
  keywords: [
    "PC game reviews",
    "game recommendations",
    "best PC games",
    "Steam game reviews",
    "Epic Games reviews",
    "GamesDealsHub reviews",
  ],
  alternates: { canonical: `${siteUrl}/reviews` },
  openGraph: {
    title: "PC Game Reviews | GamesDealsHub",
    description: "Practical PC game reviews for deal hunters, backlog builders, and players deciding what to claim or buy.",
    url: `${siteUrl}/reviews`,
    siteName: "GamesDealsHub",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "GamesDealsHub Reviews" }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PC Game Reviews | GamesDealsHub",
    description: "Practical reviews for PC game deal hunters.",
    images: ["/og-image.jpg"],
  },
};

const reviews = [
  {
    title: "Helldivers 2 Review: Co-op Chaos That Still Feels Fresh",
    score: "9.3",
    product: "Helldivers 2",
    body: [
      "Helldivers 2 works because it understands that co-op games are at their best when plans collapse. The mission structure is simple on paper: drop onto a hostile planet, complete objectives, call extraction, and survive long enough to leave. The drama comes from everything that happens between those steps. A teammate drops an orbital strike too close, a patrol hears gunfire, a charger interrupts a reload, and a perfect extraction turns into a comedy of desperate dives and accidental heroism.",
      "The stratagem system remains the star. Calling support weapons and airstrikes through directional inputs creates a tiny moment of vulnerability every time you need help. It is more interesting than pressing a single ability key because it forces you to choose your timing. Friendly fire makes every powerful tool dangerous, but rarely unfair. When a squad wipe happens, the blame usually becomes part of the story. That social friction gives Helldivers 2 a personality many live-service shooters lack.",
      "Progression is strong because equipment changes how you approach problems without making early gear obsolete. Some weapons need tuning, and matchmaking can still be imperfect during busy periods, but the core loop is sturdy. The galactic war layer gives routine missions a larger purpose, especially when major orders push the community toward a shared front. Monetization is also better than expected: premium currency can be earned in missions, and warbonds do not vanish after a season.",
      "Performance is generally solid on a wide range of PCs, though the busiest battles can be CPU-heavy when enemies, explosions, and physics objects stack up. Lowering volumetric effects and shadows helps more than lowering textures, and a stable frame cap can make chaotic missions feel smoother. The game also benefits from a headset and a regular squad, but public matchmaking is strong enough that solo players can still enjoy the loop.",
      "For deal hunters, Helldivers 2 is not the cheapest recommendation, but it is a high-confidence wishlist target. If you see a meaningful discount, it is worth serious consideration, especially with friends. Solo play is possible, but the game shines when communication, panic, and bad decisions collide. It is a rare modern multiplayer release where the best moments are not just victories; they are the stories you retell afterward.",
    ],
  },
  {
    title: "Hades Review: The Rare Roguelike That Respects Your Time",
    score: "9.6",
    product: "Hades",
    body: [
      "Hades is one of the easiest PC games to recommend because it solves the biggest problem many players have with roguelikes: repetition fatigue. Every failed escape attempt sends Zagreus back to the House of Hades, but returning home rarely feels like a reset. Characters react, relationships develop, new dialogue appears, and the world acknowledges your progress. Even a bad run can move the story forward, which makes the loop feel generous instead of punishing.",
      "Combat is fast, readable, and expressive. Each weapon changes your rhythm, and boons from Olympian gods push builds in surprising directions. A sword run with lightning effects feels different from a bow run built around critical hits or a shield run focused on safe deflection. The game gives enough control to chase a preferred build while preserving the improvisational spark that makes roguelikes exciting. Runs are short enough for a lunch break but deep enough to sustain dozens of hours.",
      "The presentation still holds up beautifully. Character art is sharp, voice acting is warm, and the soundtrack gives each region a clear identity. More importantly, Hades avoids the cold efficiency that can make some action roguelikes feel mechanical. It has style, but it also has heart. The writing turns gods, rivals, mentors, and shopkeepers into reasons to keep playing beyond pure mechanical mastery.",
      "It is also a friendly game for varied hardware. Hades runs well on modest PCs, loads quickly, and works beautifully with a controller. That makes it an excellent laptop, handheld, or living-room pick. The difficulty options are thoughtful too. God Mode gradually increases damage resistance after failed runs, so players who want the story can keep progressing without removing the satisfaction of combat. Accessibility here is practical, not performative.",
      "The only real warning is that Hades can make short sessions turn into longer ones. Its pace, quick restarts, and steady dialogue rewards make one more run feel harmless until an hour disappears.",
      "From a deal perspective, Hades is a must-watch title. It has appeared in major sales often enough that patient players can usually find a strong discount, and it is valuable even at full price. If it ever appears in a free campaign or subscription perk, claim it immediately. Hades belongs in almost every PC library: approachable, replayable, polished, and respectful of players who only have a few runs per week.",
    ],
  },
  {
    title: "Deep Rock Galactic Review: The Best Value Co-op Game for Long-Term Players",
    score: "9.1",
    product: "Deep Rock Galactic",
    body: [
      "Deep Rock Galactic has quietly become one of PC gaming's strongest co-op recommendations because it combines clear class roles with endlessly variable missions. You play as space dwarves mining hostile caves, but the premise undersells how elegant the design is. The Scout lights huge caverns and reaches minerals, the Engineer builds platforms, the Gunner protects the team, and the Driller reshapes the map. Every class feels useful, and a good squad naturally creates teamwork without needing strict voice communication.",
      "The caves are the real magic. Procedural generation produces spaces that feel dangerous, vertical, and memorable. One mission might be a clean mining run, while the next becomes a frantic retreat through twisting tunnels as enemies pour in from every wall. Objectives vary enough to prevent routine from setting in, and difficulty scaling lets casual groups and serious players both find a comfortable challenge. The game is also refreshingly readable: you usually understand why a mission went wrong and what to improve next time.",
      "Progression is generous. Weapons, cosmetics, perks, and class promotions create long-term goals without turning the game into a grind trap. Seasonal content has been handled with unusual respect for players, avoiding the fear-driven design that makes many live-service games exhausting. You can leave for months, return, and still feel welcome. That quality is rare and important for adults with inconsistent gaming schedules.",
      "The technical footprint is another advantage. Deep Rock Galactic looks distinct without demanding extreme hardware, and its readable art direction helps players understand threats in dark, messy spaces. Audio cues are useful, mission length is flexible, and the ping system makes communication easy even without voice chat. That combination makes it one of the rare co-op games that works for both organized groups and casual public lobbies.",
      "It is less compelling if you strongly dislike repeatable mission structures, but the class variety and cave generation do a lot to keep familiar objectives lively.",
      "Deep Rock Galactic is a prime sale recommendation and an excellent candidate for group gifting. It is often discounted, runs well on modest PCs, and supports hundreds of hours of play if the co-op loop clicks with your group. The humor is loud, the community is unusually friendly, and the value is outstanding. For deal hunters deciding what deserves storage space after a discount, this is one of the safest co-op picks on PC.",
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
    name: "GamesDealsHub PC Game Reviews",
    description: "Editorial PC game recommendations for players tracking free games and discounts.",
    brand: { "@type": "Brand", name: "GamesDealsHub" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "9.3", reviewCount: "3" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does GamesDealsHub choose games to review?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We prioritize games that are good sale targets, strong backlog additions, or likely to interest players who follow free game and discount campaigns.",
        },
      },
      {
        "@type": "Question",
        name: "Are these reviews focused on full-price buying?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Reviews are written for practical deal decisions, including whether a game is worth claiming, wishlisting, buying on sale, or playing through a subscription.",
        },
      },
    ],
  },
];

export default function ReviewsPage() {
  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <main className="min-h-screen px-4 py-24 md:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#06B6D4]">Game Reviews</span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              Reviews For Deal Hunters
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#9CA3AF]">
              Practical reviews focused on value, replayability, sale timing, and whether a game deserves a permanent spot in your PC library.
            </p>
          </header>

          <div className="space-y-10">
            {reviews.map((review) => (
              <article key={review.title} className="rounded-2xl border border-white/10 bg-[#0F172A]/80 p-6 md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-[10px] font-orbitron font-bold uppercase tracking-widest text-[#8B5CF6]">
                    {review.product}
                  </p>
                  <span className="rounded-lg border border-[#06B6D4]/40 bg-[#06B6D4]/10 px-3 py-1 text-sm font-bold text-[#06B6D4]">
                    {review.score}/10
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-white">{review.title}</h2>
                <div className="mt-7 space-y-5 font-poppins text-[15px] leading-8 text-[#D1D5DB]">
                  {review.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 70)}>{paragraph}</p>
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
