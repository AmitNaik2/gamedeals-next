import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getGameDealById, getActiveGames } from "../../../lib/gamerpower";
import { type GameDeal } from "../../../types";
import { GameDetail } from "../../../components/GameDetail";

export const revalidate = 3600;

async function fetchServerDeal(id: string): Promise<GameDeal | null> {
  const cleanId = id.replace("gp_", "");
  return getGameDealById(cleanId);
}

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const game = await fetchServerDeal(params.id);
  
  if (!game) {
    return { title: 'Deal Not Found - GamesDealsHub' };
  }

  const title = `${game.title} — Free on ${game.platforms} | GamesDealsHub`;
  const description = game.description ? `${game.description.slice(0, 155)}...` : `Get ${game.title} for free!`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gamesdealshub.me/game/${params.id}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: game.image, width: 1200, height: 630 }],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [game.image]
    }
  };
}

export default async function GamePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const game = await fetchServerDeal(params.id);

  if (!game) {
    notFound();
  }

  const activeGames = await getActiveGames();
  const relatedGames = activeGames.filter(g => g.id !== game.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": game.title,
    "description": game.description,
    "image": game.image,
    "brand": { "@type": "Brand", "name": game.platforms },
    "sku": game.id,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": game.users ?? 100
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": game.end_date !== "N/A" && game.end_date !== "2099-12-31"
        ? new Date(game.end_date).toISOString().split("T")[0] 
        : undefined,
      "url": game.open_giveaway_url || game.gamerpower_url
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <GameDetail deals={[game]} isLoading={false} />

      {/* You Might Also Like */}
      {relatedGames.length > 0 && (
        <div className="bg-[#070A11] px-4 md:px-8 pb-20 font-poppins">
          <div className="max-w-5xl mx-auto pt-8 border-t border-white/5">
            <h3 className="text-2xl font-orbitron font-bold text-white uppercase tracking-widest mb-8">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedGames.map(related => (
                <Link key={related.id} href={`/game/${related.id}`} className="group relative bg-[#0F172A]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-[#06B6D4]/50 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <div className="relative w-full aspect-video">
                    <Image src={related.image} alt={related.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 text-white text-[10px] font-bold font-orbitron uppercase tracking-widest rounded">FREE</div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-[#06B6D4] font-orbitron font-bold uppercase tracking-widest">{related.platforms}</span>
                    <h4 className="text-white font-bold mt-1 line-clamp-1">{related.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function generateStaticParams() {
  const games = await getActiveGames();
  return games.map((game) => ({
    id: game.id,
  }));
}
