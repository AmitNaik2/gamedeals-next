import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { type GameDeal } from "../types";
import { BadgeCheck, ArrowLeft, ExternalLink, Gamepad2, Users, Star } from "lucide-react";
import { generateUniqueSummary, generateTags } from "../lib/text-utils";
import { Countdown } from "./Countdown";
import { getDealRarity } from "../lib/deal-utils";
import { useIgdb } from "../hooks/useIgdb";

import { cn } from "../lib/utils";

export function GameDetail({ deals, isLoading }: { deals: GameDeal[], isLoading?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<GameDeal | null>(null);

  useEffect(() => {
    if (deals.length > 0) {
      const found = deals.find((d) => String(d.id) === id || decodeURIComponent(String(d.id)) === id);
      if (found) setDeal(found);
    }
  }, [id, deals]);

  const gameInfo = useIgdb(deal?.title);

  if (!deal && !isLoading && deals.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold font-serif mb-4">Deal Not Found</h2>
        <button onClick={() => navigate("/")} className="text-[#7C3AED] hover:underline">
          Return to Home
        </button>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-[#7C3AED] rounded-full animate-spin"></div>
      </div>
    );
  }

  const tags = generateTags(deal.title, deal.platforms, deal.type, deal.description);
  const rewrittenSummary = generateUniqueSummary(deal.title, deal.description, deal.type, deal.platforms);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
      <Helmet>
        <title>{deal.title} - Free {deal.platforms} Game | GamesDealsHub</title>
        <meta name="description" content={rewrittenSummary} />
        <meta property="og:title" content={`${deal.title} is currently Free!`} />
        <meta property="og:description" content={rewrittenSummary} />
        <meta property="og:image" content={deal.image || deal.thumbnail} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": deal.title,
            "image": deal.image || deal.thumbnail,
            "description": rewrittenSummary,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": "89"
            },
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
              },
              "author": {
                "@type": "Person",
                "name": "Amit Naik"
              }
            },
            "offers": {
              "@type": "Offer",
              "url": `https://gamesdealshub.me/game/${deal.id}`,
              "priceCurrency": "USD",
              "price": deal.salePrice || "0.00",
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": deal.platforms ? deal.platforms.split(',')[0] : "Steam"
              }
            }
          })}
        </script>
      </Helmet>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 uppercase tracking-widest text-[10px] font-bold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Deals
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-black/40 border border-white/10 rounded-3xl p-6 lg:p-8 backdrop-blur-xl">
        <div className="rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.15)] group">
          <img src={deal.image || deal.thumbnail} alt={deal.title} className="w-full object-cover aspect-video group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg">
            <BadgeCheck className="w-3 h-3" /> Verified Free
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-[#7C3AED]/20 px-2.5 py-1 rounded border border-[#7C3AED]/30 text-[10px] uppercase font-mono tracking-widest text-[#7C3AED]">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl lg:text-5xl font-serif italic font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            {deal.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Original Value</span>
              <span className={cn("font-mono text-xl", deal.type === 'Game Info' ? "text-white/40" : "text-rose-500 line-through")}>{deal.worth !== "N/A" ? deal.worth : (deal.type === 'Game Info' ? "N/A" : "$0.00")}</span>
            </div>
            <div className="w-px h-8 bg-white/10 opacity-50"></div>
            <div className="flex flex-col">
               <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Current Price</span>
               <span className={cn("font-mono text-xl md:text-2xl font-bold px-2 rounded", deal.type === 'Game Info' ? "text-[#7C3AED] bg-[#7C3AED]/10" : "text-green-400 bg-green-400/10")}>{deal.type === 'Game Info' ? "INFO" : (deal.salePrice ? `$${deal.salePrice}` : "FREE")}</span>
            </div>
          </div>

          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            {rewrittenSummary}
          </p>

          <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl p-4 mb-8">
            <h3 className="text-sm font-bold text-white mb-2 tracking-wide">{deal.type === 'Game Info' ? `About ${deal.title}` : `Why You Should Play ${deal.title}`}</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {deal.type === 'Game Info' 
                ? `Search result across multiple platforms. Click below to view available stores.` 
                : `If you usually miss out on expensive games, ${deal.title} is a fantastic addition to your library right now. By claiming this deal, you are instantly saving ${deal.worth !== "N/A" ? deal.worth : "money"} and securing a top-rated title. ${deal.salePrice ? "Take advantage of this discount today." : "The free format makes it a great choice to pick up today."}`}
            </p>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 text-white/50 mb-1">
               <span className="text-xs font-bold tracking-widest uppercase">Compare Stores</span>
             </div>
             {deals
                .filter(d => d.title.toLowerCase() === deal.title.toLowerCase())
                .sort((a, b) => {
                   if (a.type === 'Game Info') return 1;
                   if (b.type === 'Game Info') return -1;
                   const priceA = parseFloat(a.salePrice || "0") || 0;
                   const priceB = parseFloat(b.salePrice || "0") || 0;
                   return priceA - priceB;
                })
                .reduce((acc, curr) => {
                   // Remove complete duplicates if store and price matches
                   if (!acc.find(d => d.platforms === curr.platforms && d.salePrice === curr.salePrice)) {
                      acc.push(curr);
                   }
                   return acc;
                }, [] as GameDeal[])
                .map((relatedDeal, idx) => {
                   const isBestResult = idx === 0 && relatedDeal.type !== 'Game Info';
                   return (
                   <div 
                     key={relatedDeal.id}
                     className={cn(
                       "flex items-center justify-between p-4 rounded-xl border transition-colors",
                       isBestResult 
                         ? "bg-blue-950/20 border-blue-600/50" 
                         : "bg-black/40 border-white/5 hover:border-white/10"
                     )}
                   >
                     <div className="flex flex-col items-start gap-1">
                       <span className="font-bold text-base text-white">{relatedDeal.platforms}</span>
                       {isBestResult && (
                         <span className="text-[10px] uppercase tracking-widest font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                           Best Deal
                         </span>
                       )}
                     </div>
                     
                     <div className="flex items-center gap-4">
                       <div className="flex flex-col items-end justify-center">
                         {relatedDeal.normalPrice && relatedDeal.normalPrice !== "N/A" && relatedDeal.salePrice !== relatedDeal.normalPrice && (
                           <span className="text-white/40 text-[11px] line-through leading-none mb-1 font-mono">
                             ${relatedDeal.normalPrice}
                           </span>
                         )}
                         {relatedDeal.type === 'Game Info' ? (
                            <span className="font-bold text-[#7C3AED] text-lg leading-none font-mono">INFO</span>
                         ) : (
                            <span className={cn(
                              "font-bold text-lg leading-none font-mono", 
                              isBestResult ? "text-blue-500" : "text-green-400"
                            )}>
                              {relatedDeal.salePrice === "0.00" || !relatedDeal.salePrice ? "FREE" : `$${relatedDeal.salePrice}`}
                            </span>
                         )}
                       </div>
                       <a 
                         href={relatedDeal.open_giveaway_url}
                         target="_blank"
                         rel="noopener noreferrer nofollow sponsored"
                         className={cn(
                           "flex items-center justify-center w-10 h-10 rounded-xl transition-all shadow-sm",
                           isBestResult 
                             ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20" 
                             : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                         )}
                       >
                         <ExternalLink className="w-5 h-5" />
                       </a>
                     </div>
                   </div>
                 )})}
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12 bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8">
          <div>
            <h2 className="text-xl font-serif italic opacity-90 mb-4 inline-flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#7C3AED]" /> 
              {deal.type === 'Game Info' || deal.type === 'Price Comparison' || deal.type === 'Discount' ? `How to get ${deal.title}` : `How do I claim the ${deal.platforms.split(',')[0]} giveaway?`}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap bg-black/40 p-5 rounded-2xl border border-white/5">
              {deal.instructions}
            </p>
          </div>
          <div>
             <h3 className="text-xl font-serif italic opacity-90 mb-4 inline-flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-green-500" /> Offer Details</h3>
             <ul className="space-y-4">
               {deal.type !== 'Game Info' && deal.type !== 'Price Comparison' && deal.type !== 'Discount' && (
                 <li className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                   <div className="flex flex-col">
                     <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Offer Ends</span>
                     {deal.end_date !== "N/A" && <span className="text-sm font-bold text-white/80">Deal ends: {deal.end_date}</span>}
                   </div>
                   {deal.end_date !== "N/A" ? <Countdown endDate={deal.end_date} /> : <span className="text-sm font-mono text-rose-400 font-bold">Unknown (Hurry!)</span>}
                 </li>
               )}
               <li className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                 <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Rarity Level</span>
                 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                   {getDealRarity(deal).label}
                 </span>
               </li>
               <li className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                 <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Platforms</span>
                 <span className="text-sm text-white/80">{deal.platforms}</span>
               </li>
             </ul>
          </div>
      </div>
    </div>
  );
}
