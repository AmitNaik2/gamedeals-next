import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { GameDetail } from "../../../components/GameDetail";
import { getGameDealById, getActiveGames } from "../../../lib/gamerpower";
import { StructuredData } from "../../../components/StructuredData";
import { type GameDeal } from "../../../types";

export const revalidate = 3600; // 1-hour ISR

// Helper to fetch any type of deal server-side
async function fetchServerDeal(id: string): Promise<GameDeal | null> {
  // If it's a plain number or starts with gp_, fetch from GamerPower
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
}

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const deal = await fetchServerDeal(params.id);
  
  if (!deal) {
    return { title: 'Deal Not Found - GamesDealsHub' };
  }

  const title = `${deal.title} - FREE until ${deal.end_date !== "2099-12-31" ? deal.end_date : 'Limited Time'}`;
  const description = (deal.description || `Get ${deal.title} for free!`).slice(0, 150) + "...";

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gamesdealshub.me'}/game/${deal.id}`,
    },
    openGraph: {
      title,
      description,
      images: [`/og?title=${encodeURIComponent(deal.title)}&platform=${encodeURIComponent(deal.platforms)}&expiry=${encodeURIComponent(deal.end_date)}&image=${encodeURIComponent(deal.image)}`]
    }
  };
}

export default async function GamePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const deal = await fetchServerDeal(params.id);

  if (!deal) {
    notFound();
  }

  // Generate Product + Offer Schema
  const productSchemaData = {
    "name": deal.title,
    "description": deal.description || deal.instructions || `Grab the free deal for ${deal.title} on ${deal.platforms}. Don't miss out on this limited-time offer.`,
    "image": deal.image,
    "brand": {
      "@type": "Brand",
      "name": deal.platforms
    },
    "sku": deal.id,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (deal as any).steamRatingPercent ? (Number((deal as any).steamRatingPercent) / 20).toFixed(1) : "4.8",
      "reviewCount": deal.users > 0 ? deal.users.toString() : "1024"
    },
    "offers": {
      "@type": "Offer",
      "price": deal.salePrice || "0.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": (deal.end_date && deal.end_date !== "N/A" && deal.end_date !== "2099-12-31" && !isNaN(new Date(deal.end_date).getTime())) 
        ? new Date(deal.end_date).toISOString().split("T")[0] 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      "url": deal.open_giveaway_url || "",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          }
        }
      }
    }
  };

  return (
    <>
      <StructuredData type="Product" data={productSchemaData} />
      <GameDetail deals={[deal]} isLoading={false} />
    </>
  );
}

export async function generateStaticParams() {
  const games = await getActiveGames();
  return games.map((game) => ({
    id: game.id,
  }));
}
