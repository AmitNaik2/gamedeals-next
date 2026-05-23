"use client";

import { useEffect, useState } from "react";
import { GameDetail } from "../../../components/GameDetail";
import { type GameDeal } from "../../../types";

export default function GamePage() {
  const [deals, setDeals] = useState<GameDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const [resGames, resUpcoming, dbRes, premiumRes] = await Promise.all([
          fetch("/api/giveaways-feed?type=game").catch(() => null),
          fetch("/api/upcoming-free-games").catch(() => null),
          fetch("/api/dlc-feed").catch(() => null),
          fetch("/api/premium-feed").catch(() => null)
        ]);

        let allDeals: GameDeal[] = [];

        // Safely parse JSON to prevent crashes if an API returns an error object instead of an array
        const safeParse = async (res: Response | null) => {
          if (!res || !res.ok) return [];
          try {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
          } catch { return []; }
        };

        const [games, upcoming, dlc] = await Promise.all([
          safeParse(resGames),
          safeParse(resUpcoming),
          safeParse(dbRes)
        ]);
        const formattedGames = games.map((deal: any) => ({
          ...deal,
          id: `gp_${deal.id}`
        }));
        
        allDeals = [...formattedGames, ...upcoming, ...dlc];
        
        if (premiumRes && premiumRes.ok) {
           try {
             let csData = await premiumRes.json();
             if (Array.isArray(csData)) {
               const csDeals: GameDeal[] = csData.map((cs: any) => ({
                  id: "cs_" + cs.dealID,
                  title: cs.title,
                  description: "Premium Deal on " + (cs.storeName || "Store"),
                  instructions: "Get it on " + (cs.storeName || "Store"),
                  url: cs.dealID ? "https://www.cheapshark.com/redirect?dealID=" + cs.dealID : "",
                  image: cs.thumb || "",
                  type: "Discount",
                  platforms: "PC",
                  users: 0,
                  status: "Active",
                  savings: cs.savings,
                  salePrice: cs.salePrice,
                  normalPrice: cs.normalPrice,
                  dealRating: cs.dealRating,
                  steamRatingText: cs.steamRatingText,
                  steamRatingPercent: cs.steamRatingPercent,
                  steamRatingCount: cs.steamRatingCount,
                  storeName: cs.storeName,
                  steamAppID: cs.steamAppID,
                  worth: cs.normalPrice || "$0.00",
                  thumbnail: cs.thumb || "",
                  open_giveaway_url: cs.dealID ? "https://www.cheapshark.com/redirect?dealID=" + cs.dealID : "",
                  published_date: new Date().toISOString().split('T')[0],
                  end_date: "2099-12-31",
               } as GameDeal));
               allDeals = [...allDeals, ...csDeals];
             }
           } catch(e) {}
        }
        
        // If the current game ID is a specific RAWG or Cheapshark deal that isn't in the default feeds (e.g. from a search)
        // We should try to fetch it specifically or rely on the hook
        const urlPath = window.location.pathname;
        const currentId = urlPath.split('/game/')[1];
        
        if (currentId && currentId.startsWith('cs_')) {
           const dealID = currentId.replace('cs_', '');
           const csSpecificRes = await fetch(`https://www.cheapshark.com/api/1.0/deals?id=${dealID}`).catch(() => null);
           if (csSpecificRes && csSpecificRes.ok) {
              const csDeal = await csSpecificRes.json();
              if (csDeal && csDeal.gameInfo) {
                 allDeals.push({
                    id: currentId,
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
                 } as GameDeal);
              }
           }
        } else if (currentId && currentId.startsWith('rawg_')) {
           // For RAWG games, the GameDetail component uses useIgdb to fetch the rawg info.
           // We just need a placeholder deal to bypass the "Deal Not Found" screen!
           const titleSlug = currentId.replace('rawg_', '').replace(/-/g, ' ');
           allDeals.push({
              id: currentId,
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
           } as GameDeal);
        }

        setDeals(allDeals);
      } catch (err) {
        console.error("Failed to fetch deals for GameDetail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  return <GameDetail deals={deals} isLoading={loading} />;
}
