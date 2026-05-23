import ClientHome from "./ClientHome";
import { getActiveGames } from "../lib/gamerpower";
import { StructuredData } from "../components/StructuredData";
import { GameDeal } from "../types";

// ── Epic upcoming games ───────────────────────────────────────────────────────

interface UpcomingGame {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  originalPrice: string;
  platforms: string;
  type: string;
}

async function getUpcomingGames(): Promise<UpcomingGame[]> {
  try {
    const epicUrl =
      "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US";
    const res = await fetch(epicUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error(`[epic] getUpcomingGames failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    const elements: any[] = data?.data?.Catalog?.searchStore?.elements || [];

    const upcoming = elements.filter(
      (el) =>
        el.promotions?.upcomingPromotionalOffers?.length > 0
    );

    return upcoming.map((item) => {
      const promo = item.promotions.upcomingPromotionalOffers[0].promotionalOffers[0];
      const imageObj =
        item.keyImages?.find((img: any) => img.type === "OfferImageWide") ||
        item.keyImages?.find((img: any) => img.type === "Thumbnail") ||
        item.keyImages?.[0];

      return {
        id: item.id,
        title: item.title,
        description: item.description ?? "",
        image: imageObj?.url ?? "",
        startDate: promo?.startDate ?? "",
        endDate: promo?.endDate ?? "",
        originalPrice: item.price?.totalPrice?.fmtPrice?.originalPrice ?? "Paid",
        platforms: "Epic Games",
        type: "Free Game",
      };
    });
  } catch (err) {
    console.error("[epic] getUpcomingGames error:", err);
    return [];
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function Home() {
  const [activeGames, upcomingGames] = await Promise.all([
    getActiveGames(),
    getUpcomingGames(),
  ]);

  // JSON-LD: ItemList with typed GameDeal
  const itemListSchemaData = {
    itemListElement: activeGames.slice(0, 10).map((game: GameDeal, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: game.title,
        description: game.description,
        image: game.image,
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          ...(game.end_date && game.end_date !== "N/A"
            ? { priceValidUntil: new Date(game.end_date).toISOString().split("T")[0] }
            : {}),
          url: game.open_giveaway_url || game.gamerpower_url,
        },
      },
    })),
  };

  return (
    <>
      <StructuredData type="ItemList" data={itemListSchemaData} />
      <ClientHome
        initialActiveGames={activeGames}
        initialUpcomingGames={upcomingGames}
      />
    </>
  );
}
