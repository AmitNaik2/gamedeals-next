import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getGameDealById, getActiveGames } from "../../../lib/gamerpower";
import { type GameDeal } from "../../../types";
import { GameDetail } from "../../../components/GameDetail";

export const revalidate = 3600;

import { cache } from 'react';

const fetchServerDeal = cache(async (id: string): Promise<GameDeal | null> => {
  if (id.startsWith('gp_') || /^\d+$/.test(id)) {
    return getGameDealById(id);
  } else if (id.startsWith('cs_')) {
    const dealID = id.replace('cs_', '');
    const csRes = await fetch(`https://www.cheapshark.com/api/1.0/deals?id=${encodeURIComponent(dealID)}`, { next: { revalidate: 3600 } });
    if (csRes.ok) {
      const csDeal = await csRes.json();
      if (csDeal && csDeal.gameInfo) {
        return {
          id: id,
          title: csDeal.gameInfo.name,
          description: "Premium Deal",
          instructions: "Get it on Store",
          open_giveaway_url: "https://www.cheapshark.com/redirect?dealID=" + dealID,
          image: csDeal.gameInfo.thumb || "",
          type: "Discount",
          platforms: "PC",
          users: 0,
          status: "Active",
          salePrice: csDeal.gameInfo.salePrice,
          normalPrice: csDeal.gameInfo.retailPrice,
          worth: csDeal.gameInfo.retailPrice || "$0.00",
          thumbnail: csDeal.gameInfo.thumb || "",
          published_date: new Date().toISOString().split('T')[0],
          end_date: "2099-12-31",
        } as GameDeal;
      }
    }
  } else if (id.startsWith('rawg_')) {
    const titleSlug = id.replace('rawg_', '').replace(/-/g, ' ');
    return {
      id: id,
      title: titleSlug,
      description: "Game Information",
      instructions: "View details below",
      open_giveaway_url: "",
      image: "",
      type: "Game Info",
      platforms: "PC, Console",
      users: 0,
      status: "Active",
      worth: "$0.00",
      thumbnail: "",
      published_date: new Date().toISOString().split('T')[0],
      end_date: "2099-12-31",
    } as GameDeal;
  } else if (id.startsWith('steam_free_')) {
    const appId = id.replace('steam_free_', '');
    let title = "Steam Free Deal";
    try {
       const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`, { next: { revalidate: 3600 } });
       if (res.ok) {
           const data = await res.json();
           if (data && data[appId] && data[appId].success && data[appId].data) {
               title = data[appId].data.name;
           }
       }
    } catch (e) {}

    return {
      id: id,
      title: title,
      description: "100% Off Promotional Deal on Steam.",
      instructions: "Claim directly on the Steam store.",
      open_giveaway_url: `https://store.steampowered.com/app/${appId}/`,
      image: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
      type: "Free Game",
      platforms: "Steam",
      users: 0,
      status: "Active",
      worth: "N/A",
      salePrice: "0.00",
      normalPrice: "0.00",
      thumbnail: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
      published_date: new Date().toISOString().split('T')[0],
      end_date: "2099-12-31",
      steamAppID: appId,
    } as GameDeal;
  }
  return null;
});

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
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
