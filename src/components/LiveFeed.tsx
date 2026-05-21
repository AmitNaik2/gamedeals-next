import { motion, AnimatePresence } from "motion/react";
import { type GameDeal } from "../types";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function LiveFeed({ deals }: { deals: GameDeal[] }) {
  if (!deals || deals.length === 0) return null;

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.1)] relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 blur-[50px] mix-blend-screen pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-4 h-4 text-[#06B6D4]" />
        <h3 className="text-[11px] font-orbitron font-bold uppercase tracking-widest text-[#F9FAFB] glow-text">Live Activity</h3>
      </div>
      
      <div className="space-y-4">
        {deals.slice(0, 5).map((deal, i) => (
          <Link to={`/game/${deal.id}`} key={`${deal.id}-feed`}>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-start border-b border-white/5 pb-4 last:border-0 last:pb-0 hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all duration-300 cursor-pointer hover:pl-2 group/item"
            >
              <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden bg-black/50 border border-white/10 group-hover/item:border-[#06B6D4]/50 transition-colors">
                 <img src={deal.thumbnail} alt={deal.title} className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-orbitron font-bold text-white mb-1.5 line-clamp-1 group-hover/item:text-[#8B5CF6] transition-colors">{deal.title}</p>
                <div className="flex items-center gap-1.5 text-[9px] font-poppins uppercase tracking-widest text-[#06B6D4]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse shadow-[0_0_5px_rgba(6,182,212,0.8)]"></span>
                    New Deal Discovered
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
