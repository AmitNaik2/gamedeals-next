import { motion, AnimatePresence } from "motion/react";
import { type GameDeal } from "../types";
import { Zap, Activity, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

export function LiveFeed({ deals }: { deals: GameDeal[] }) {
  if (!deals || deals.length === 0) return null;

  return (
    <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#06B6D4]/30 rounded-3xl p-5 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)] relative group w-full">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#06B6D4]/10 blur-[50px] mix-blend-screen pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2 relative z-10">
        <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#06B6D4]" />
            <h3 className="text-[11px] font-orbitron font-bold uppercase tracking-[0.2em] text-[#F9FAFB] drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">Live Telemetry</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
      </div>
      
      <div className="space-y-4 relative z-10">
        {deals.slice(0, 5).map((deal, i) => (
          <Link to={`/game/${deal.id}`} key={`${deal.id}-feed`}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-start border-b border-white/5 pb-4 last:border-0 last:pb-0 hover:bg-[#06B6D4]/5 p-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer hover:pl-2 group/item"
            >
              <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden bg-black/50 border border-white/10 group-hover/item:border-[#06B6D4]/50 transition-colors shadow-none group-hover/item:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                 <img src={deal.thumbnail || deal.image} alt={deal.title} className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-orbitron font-bold text-white mb-1.5 line-clamp-1 group-hover/item:text-[#06B6D4] transition-colors">{deal.title}</p>
                <div className="flex items-center gap-1.5 text-[9px] font-poppins font-bold uppercase tracking-widest text-[#22C55E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                    Asset Identified
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* Animated Progress Bar */}
      <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
        <div className="flex justify-between text-[9px] text-[#94A3B8] uppercase tracking-widest mb-1 font-orbitron">
            <span>System Load</span>
            <span className="text-[#EC4899]">OPTIMAL</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] w-[45%] animate-[pulse_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
