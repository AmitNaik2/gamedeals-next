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
        const [resGames, resUpcoming, dbRes] = await Promise.all([
          fetch("/api/giveaways-feed?type=game").catch(() => null),
          fetch("/api/upcoming-free-games").catch(() => null),
          fetch("/api/dlc-feed").catch(() => null)
        ]);

        let allDeals: GameDeal[] = [];

        if (resGames && resGames.ok) {
           const games = await resGames.json();
           allDeals = [...allDeals, ...games];
        }
        
        if (resUpcoming && resUpcoming.ok) {
           const upcoming = await resUpcoming.json();
           allDeals = [...allDeals, ...upcoming];
        }

        if (dbRes && dbRes.ok) {
           const dlc = await dbRes.json();
           allDeals = [...allDeals, ...dlc];
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
