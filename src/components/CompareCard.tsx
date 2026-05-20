import { GameDeal } from "../types";
import { Tag, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export function CompareCard({ deals }: { deals: GameDeal[] }) {
  // find the first deal with an image that isn't just game info (to ensure a good cover)
  const firstDeal = deals.find(d => d.type !== 'Game Info' && d.image) || deals[0];
  const title = firstDeal.title;
  // prioritize high res image if possible, but thumbnail will do
  const image = firstDeal.image || firstDeal.thumbnail;
  const gameUrl = `/game/${firstDeal.id}`;

  // Sort deals putting the cheapest first, and moving 'Game Info' (RAWG) to the end
  const sortedDeals = [...deals].sort((a, b) => {
    if (a.type === 'Game Info') return 1;
    if (b.type === 'Game Info') return -1;
    const priceA = parseFloat(a.salePrice || "0") || 0;
    const priceB = parseFloat(b.salePrice || "0") || 0;
    return priceA - priceB;
  });

  return (
    <div className="flex flex-col overflow-hidden transition-all duration-300 border bg-white/5 border-white/10 rounded-xl group relative">
      {/* Header with image */}
      <div className="relative w-full aspect-video sm:aspect-[2.5/1] shrink-0 overflow-hidden bg-black/50 border-b border-white/10 group-hover:bg-black/40">
        <Link to={gameUrl} className="block w-full h-full">
          <img 
            src={image} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <h3 className="absolute bottom-4 left-4 right-4 text-2xl md:text-3xl font-bold text-white z-10 leading-tight font-serif italic line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
            {title}
          </h3>
        </Link>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-white/40 mb-4">
          <Tag className="w-3 h-3" />
          <span>Compare Stores</span>
        </div>

        <div className="flex flex-col gap-2">
          {sortedDeals.map((deal, idx) => {
            const isBestResult = idx === 0 && deal.type !== 'Game Info';
            return (
            <div 
              key={deal.id}
              className={cn(
                "flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-colors",
                isBestResult 
                  ? "bg-[#7C3AED]/10 border-[#7C3AED]/40" 
                  : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]"
              )}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-bold text-sm sm:text-base text-white">{deal.platforms}</span>
                {isBestResult && (
                  <span className="text-[9px] uppercase tracking-widest font-bold bg-[#7C3AED] text-white px-1.5 py-0.5 rounded">
                    Best Deal
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex flex-col items-end justify-center">
                  {deal.normalPrice && deal.normalPrice !== "N/A" && deal.salePrice !== deal.normalPrice && (
                    <span className="text-white/40 text-[10px] sm:text-[11px] line-through leading-none mb-1 font-mono">
                      ${deal.normalPrice}
                    </span>
                  )}
                  {deal.type === 'Game Info' ? (
                     <span className="font-bold text-[#7C3AED] text-base sm:text-lg leading-none font-mono tracking-tighter">INFO</span>
                  ) : (
                     <span className={cn(
                       "font-bold text-base sm:text-lg leading-none font-mono tracking-tighter", 
                       isBestResult ? "text-[#7C3AED]" : "text-green-400"
                     )}>
                       {deal.salePrice === "0.00" ? "FREE" : `$${deal.salePrice}`}
                     </span>
                  )}
                </div>
                <a 
                  href={deal.open_giveaway_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all shrink-0",
                    isBestResult 
                      ? "bg-gradient-to-r from-[#7C3AED] to-cyan-500 text-white hover:opacity-90 shadow-[0_0_15px_rgba(124,58,237,0.4)]" 
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
