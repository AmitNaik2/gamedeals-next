import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, PlaySquare, Radar, Crosshair, Terminal, Activity } from "lucide-react";
import { cn } from "../lib/utils";

const FEED_MESSAGES = [
  "GLOBAL_LINK: ACTIVE",
  "PRICE_SCAN: RUNNING",
  "EPIC_VAULT_DECRYPTION: 84%",
  "MARKET_ANOMALY_DETECTED",
  "STEALTH_MODE: ENGAGED",
  "HISTORICAL_LOW_FOUND",
  "STEAM_API_SYNC: COMPLETE"
];

export function HeroSection({ onExploreClick, onTrendingClick, onFreeGamesClick, onUpcomingClick }: { onExploreClick?: () => void, onTrendingClick?: () => void, onFreeGamesClick?: () => void, onUpcomingClick?: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % FEED_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#050816] border border-[#8B5CF6]/30 mb-12 min-h-[600px] flex justify-center items-center shadow-[0_0_50px_rgba(139,92,246,0.2)] group font-orbitron">
      {/* Background Cyberpunk Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#0F172A] to-[#050816]"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px)", backgroundSize: "100% 4px" }}></div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-[#8B5CF6]/15 via-transparent to-transparent"></div>

      {/* Radar Sweep Arc */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-[#8B5CF6]/10 border-t-[#8B5CF6]/50 animate-[spin_8s_linear_infinite] opacity-40 pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-[#06B6D4]/10 border-b-[#06B6D4]/50 animate-[spin_6s_linear_infinite_reverse] opacity-40 pointer-events-none z-0"></div>

      <div className="relative z-10 p-4 sm:p-12 max-w-6xl w-full flex flex-col items-center">
        
        <motion.div
          className="flex flex-col items-center text-center max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#EF4444]/50 bg-[#EF4444]/10 text-[#EF4444] text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Market Surveillance
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F8FAFC] leading-[1.1] tracking-tighter mb-6 uppercase">
            Track Free PC Games, Upcoming Giveaways & <br className="hidden lg:block"/>
            Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#06B6D4] glow-text drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">Deal Intel</span>
          </h1>
          
          <p className="text-[#94A3B8] text-base sm:text-lg mb-10 max-w-2xl font-poppins leading-relaxed">
            Real-time surveillance of Steam, Epic Games, GOG, Humble Bundle, Fanatical, and global gaming market anomalies.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button 
              onClick={onExploreClick}
              className="h-12 px-8 rounded relative overflow-hidden bg-[#8B5CF6]/10 border border-[#8B5CF6] text-[#F8FAFC] font-bold uppercase tracking-widest text-xs hover:bg-[#8B5CF6] hover:text-[#050816] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-2 group">
              <Crosshair className="w-4 h-4" /> Access Intel
            </button>
            <button 
              onClick={onFreeGamesClick}
              className="h-12 px-8 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/50 text-[#06B6D4] hover:bg-[#06B6D4] hover:text-[#050816] font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Radar className="w-4 h-4" /> Scan Free Games
            </button>
            <button 
              onClick={onUpcomingClick}
              className="h-12 px-8 rounded bg-transparent border border-[#94A3B8]/30 hover:border-[#F8FAFC] text-[#94A3B8] hover:text-[#F8FAFC] font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8B5CF6]" /> View Upcoming Drops
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-12 text-[10px] text-[#06B6D4] pt-8 bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/5 w-full">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
               <span className="uppercase tracking-widest font-bold text-white/90">GLOBAL_LINK: <span className="text-[#22C55E]">ACTIVE</span></span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse"></span>
               <span className="uppercase tracking-widest font-bold text-white/90">PRICE_SCAN: <span className="text-[#06B6D4]">RUNNING</span></span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
               <span className="uppercase tracking-widest font-bold text-white/90">MARKET_SYNC: <span className="text-[#22C55E]">LIVE</span></span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
               <span className="uppercase tracking-widest font-bold text-white/90">EPIC_VAULT_SIGNAL: <span className="text-[#EF4444]">DETECTED</span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

