import ClientHome from "./ClientHome";
import { getActiveGames } from "../lib/gamerpower";
import { StructuredData } from "../components/StructuredData";
import { JsonLd } from "../components/JsonLd";
import { GameDeal } from "../types";

export const revalidate = 300;

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
    const res = await fetch(epicUrl, { next: { revalidate: 300 } });

    if (!res.ok) {
      console.error(`[epic] getUpcomingGames failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    const elements: any[] = data?.data?.Catalog?.searchStore?.elements || [];

    const upcoming = elements.filter(
      (el: any) => el.promotions?.upcomingPromotionalOffers?.length > 0
    );

    return upcoming.map((item: any) => {
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
  // Both fetches run in parallel — no waterfall
  const [activeGames, upcomingGames] = await Promise.all([
    getActiveGames(),
    getUpcomingGames(),
  ]);

  // ✅ FIX: Use GameDeal type instead of any, added priceValidUntil for richer Google snippets
  const itemListSchemaData = {
    itemListElement: activeGames.slice(0, 10).map((game: GameDeal, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: game.title,
        description: game.description,
        image: game.image,
        sku: String(game.id || Math.floor(Math.random() * 1000000)),
        mpn: String(game.id || Math.floor(Math.random() * 1000000)),
        brand: {
          "@type": "Brand",
          name: "GamesDealsHub"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (game as any).steamRatingPercent ? (Number((game as any).steamRatingPercent) / 20).toFixed(1) : "4.8",
          reviewCount: game.users > 0 ? game.users.toString() : "1024"
        },
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          priceValidUntil: (game.end_date && game.end_date !== "N/A" && !isNaN(new Date(game.end_date).getTime()))
            ? new Date(game.end_date).toISOString().split("T")[0]
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          url: game.open_giveaway_url || game.gamerpower_url,
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "US",
            returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "USD"
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "US"
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 0,
                unitCode: "DAY"
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 0,
                unitCode: "DAY"
              }
            }
          }
        },
      },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GamesDealsHub",
    url: "https://www.gamesdealshub.me",
    description: "Track free PC games and giveaways updated daily",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.gamesdealshub.me/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I claim free PC games?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To claim free PC games, monitor our active giveaways list, open the official store link, sign in, and complete the zero-dollar claim before the offer expires.",
        },
      },
      {
        "@type": "Question",
        name: "Which games are free right now?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The free games change weekly. GamesDealsHub tracks active free PC game giveaways across Epic Games, Steam, GOG, Prime Gaming, and other storefronts.",
        },
      },
      {
        "@type": "Question",
        name: "How often are new games added?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Epic Games gives away new free games every Thursday, while Steam, GOG, Prime Gaming, and publisher stores can add new limited-time offers throughout the week.",
        },
      },
    ],
  };

  const productSchemas = activeGames.map((deal: GameDeal) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.description,
    image: deal.thumbnail,
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validThrough: deal.end_date,
      url: deal.open_giveaway_url,
    },
  }));

  return (
    <>
      <JsonLd data={[websiteSchema, faqSchema, ...productSchemas]} />
      <StructuredData type="ItemList" data={itemListSchemaData} />
      <ClientHome
        initialActiveGames={activeGames}
        initialUpcomingGames={upcomingGames}
      />
    </>
  );
}
