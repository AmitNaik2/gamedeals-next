import { motion } from "motion/react";
import { type GameDeal } from "../types";
import { Countdown } from "./Countdown";
import { ExternalLink, BadgeCheck } from "lucide-react";
import { useIgdb } from "../hooks/useIgdb";

export function FeaturedDeal({ deal }: { deal: GameDeal }) {
  const gameInfo = useIgdb(deal?.title);
  if (!deal) return null;

  // Simulated scores
  const priceValue = parseFloat((deal.worth || "0").replace(/[^0-9.]/g, '')) || 0;
  const rawScore = 6.5 + Math.min(priceValue / 10, 2.0) + Math.min((deal.users || 0) / 10000, 2.0);
  const dealScore = Math.min(rawScore, 9.9).toFixed(1);
  const liveViewers = 40 + Math.floor((deal.users || 0) / 500) + (deal.title.length % 100);

  const bgImage = gameInfo?.background_image || deal.image || deal.thumbnail;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group overflow-hidden rounded-2xl h-[340px] sm:h-[400px] border border-white/10 mb-8"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt={deal.title} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
      
      <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-[#7C3AED] text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg backdrop-blur-md flex items-center gap-2">
        Featured Freebie
        {gameInfo?.rating && <span className="ml-2 pl-2 border-l border-white/30 text-amber-400">★ {Math.round(gameInfo.rating)}</span>}
      </div>

      <div className="absolute bottom-8 left-6 sm:left-8 z-20 max-w-full sm:max-w-[80%] pr-6">
        <div className="flex flex-wrap items-center gap-2 mb-3 text-[10px] uppercase font-mono tracking-widest text-[#7C3AED]">
          <span className="bg-[#7C3AED]/20 px-2 py-0.5 rounded border border-[#7C3AED]/30 flex items-center gap-1">
             {deal.platforms.split(',')[0]}
             <BadgeCheck className="w-3 h-3 text-blue-400" />
          </span>
          <span className="bg-[#7C3AED] text-white px-2 py-0.5 rounded shadow-[0_0_15px_rgba(124,58,237,0.5)]">
             AI SCORE: {dealScore}
          </span>
          <span>•</span>
          <span>{deal.type}</span>
          <span className="text-cyan-400 animate-pulse hidden sm:inline-block">
             • {liveViewers} VIEWING
          </span>
        </div>
        <a href={deal.open_giveaway_url} target="_blank" rel="noreferrer" className="block w-fit">
          <h2 className="text-3xl sm:text-5xl font-serif italic mb-3 text-white leading-tight hover:text-[#7C3AED] transition-colors">
            {deal.title}
          </h2>
        </a>
        <p className="text-xs sm:text-sm text-white/60 mb-6 line-clamp-2 max-w-xl">
          {deal.description}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={deal.open_giveaway_url}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-white text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#7C3AED] hover:text-white transition-colors flex items-center gap-2 rounded-sm"
          >
            Claim Now <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Countdown endDate={deal.end_date} />
        </div>
      </div>
    </motion.div>
  );
}
