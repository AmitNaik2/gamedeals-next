import { motion } from "motion/react";
import { Trophy, ArrowRight, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { type GameDeal } from "../types";

export function UpcomingDrops({ deals, onViewAll }: { deals: GameDeal[], onViewAll?: () => void }) {
  // Sort by highest worth, ignoring "N/A"
  const topDeals = [...deals].sort((a, b) => {
    const worthA = parseFloat(a.worth === "N/A" ? "0" : a.worth.replace(/[^0-9.]/g, '')) || 0;
    const worthB = parseFloat(b.worth === "N/A" ? "0" : b.worth.replace(/[^0-9.]/g, '')) || 0;
    return worthB - worthA;
  }).slice(0, 4);

  if (!topDeals.length) return null;

  return (
    <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-5 overflow-hidden mt-6 relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#7C3AED]" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Top Value Deals</h3>
        </div>
      </div>
      
      <div className="space-y-4 relative z-10">
        {topDeals.map((item, i) => (
          <Link
            to={`/game/${item.id}`}
            key={item.id}
          >
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0 hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold mb-0.5 line-clamp-1 text-white flex items-center gap-1">
                  {item.title} <BadgeCheck className="w-3 h-3 text-blue-400" />
                </p>
                <p className="text-[9px] uppercase tracking-widest text-[#7C3AED]">{item.platforms.split(',')[0]}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-amber-400 block whitespace-nowrap">{item.worth === "N/A" ? "FREE" : item.worth}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      <button onClick={onViewAll} type="button" className="w-full mt-4 py-2 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1">
        View All <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
