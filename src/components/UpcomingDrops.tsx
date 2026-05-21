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
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#F59E0B]/30 rounded-3xl p-5 overflow-hidden mt-6 relative group shadow-[0_0_20px_rgba(245,158,11,0.1)]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 blur-[50px] mix-blend-screen pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
          <h3 className="text-[11px] font-orbitron font-bold uppercase tracking-[0.2em] text-[#F9FAFB] glow-text">Top Value Deals</h3>
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
              className="flex gap-3 items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0 hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer hover:px-2 group/item"
            >
              <div>
                <p className="text-xs font-poppins font-bold mb-1 line-clamp-1 text-white flex items-center gap-1 group-hover/item:text-[#F59E0B] transition-colors">
                  {item.title} <BadgeCheck className="w-3 h-3 text-[#22C55E]" />
                </p>
                <p className="text-[9px] font-orbitron font-bold uppercase tracking-widest text-[#9CA3AF]">{item.platforms.split(',')[0]}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono font-bold text-[#F59E0B] block whitespace-nowrap bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">{item.worth === "N/A" ? "FREE" : item.worth}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      <button onClick={onViewAll} type="button" className="w-full mt-4 py-3 border border-[#F59E0B]/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#F59E0B] hover:text-[#070B14] hover:bg-[#F59E0B] transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
        View All <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
