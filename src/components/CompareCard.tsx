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
    <div className="flex flex-col overflow-hidden transition-all duration-300 border bg-[#111827]/80 backdrop-blur-md border-[#8B5CF6]/30 rounded-[24px] sm:rounded-3xl group relative shadow-[0_0_30px_rgba(139,92,246,0.1)]">
      {/* Header with image */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2.5/1] shrink-0 overflow-hidden bg-black/50 border-b border-[#8B5CF6]/20">
        <Link to={gameUrl} className="block w-full h-full">
          <img 
            src={image} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-transparent" />
          <h3 className="absolute bottom-4 left-4 right-4 text-2xl md:text-3xl font-orbitron font-bold text-[#F9FAFB] z-10 leading-tight line-clamp-2 glow-text group-hover:text-[#06B6D4] transition-colors">
            {title}
          </h3>
        </Link>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-orbitron uppercase tracking-[0.2em] text-[#9CA3AF] mb-5">
          <Tag className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Compare Stores</span>
        </div>

        <div className="flex flex-col gap-3">
          {sortedDeals.map((deal, idx) => {
            const isBestResult = idx === 0 && deal.type !== 'Game Info';
            return (
            <div 
              key={deal.id}
              className={cn(
                "flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all duration-300",
                isBestResult 
                  ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:border-[#06B6D4]/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                  : "bg-white/5 border-white/5 hover:border-[#8B5CF6]/30 hover:bg-white/[0.08]"
              )}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-poppins font-bold text-sm sm:text-base text-[#F9FAFB] group-hover:text-[#06B6D4] transition-colors">{deal.platforms}</span>
                {isBestResult && (
                  <span className="text-[9px] font-orbitron uppercase tracking-widest font-bold bg-[#8B5CF6] text-[#070B14] px-1.5 py-0.5 rounded-md shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                    Best Deal
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex flex-col items-end justify-center">
                  {deal.normalPrice && deal.normalPrice !== "N/A" && deal.salePrice !== deal.normalPrice && (
                    <span className="text-[#EF4444] text-[10px] sm:text-[11px] line-through leading-none mb-1.5 font-mono drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                      ${deal.normalPrice}
                    </span>
                  )}
                  {deal.type === 'Game Info' ? (
                     <span className="font-bold text-[#8B5CF6] text-base sm:text-lg leading-none font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">INFO</span>
                  ) : (
                     <span className={cn(
                       "font-bold text-base sm:text-lg leading-none font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]", 
                       isBestResult ? "text-[#22C55E]" : "text-[#22C55E]/80"
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
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all shrink-0",
                    isBestResult 
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-[#070B14] hover:opacity-90 shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]" 
                      : "bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
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
  );
}
