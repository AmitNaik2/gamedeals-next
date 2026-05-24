"use client";
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

export function HeroSection({ onExploreClick, onTrendingClick, onFreeGamesClick }: { onExploreClick?: () => void, onTrendingClick?: () => void, onFreeGamesClick?: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % FEED_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#050816] border border-[#06B6D4]/20 mb-12 min-h-[550px] flex items-center shadow-[0_0_50px_rgba(6,182,212,0.1)] group">
      {/* Background Cyberpunk Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#0F172A] to-[#1e1b4b]"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDExLDQzLDAuMDUpIi8+PC9zdmc+')] opacity-50 z-0"></div>

      {/* Radar Sweep Arc */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] rounded-full border border-[#8B5CF6]/10 border-t-[#8B5CF6]/40 border-r-[#06B6D4]/40 animate-[spin_10s_linear_infinite] opacity-50 pointer-events-none z-0"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] rounded-full border border-[#06B6D4]/10 border-b-[#06B6D4]/40 border-l-[#8B5CF6]/40 animate-[spin_7s_linear_infinite_reverse] opacity-50 pointer-events-none z-0"></div>

      <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-5xl mx-auto text-center lg:text-left lg:mx-0 w-full flex flex-col lg:flex-row items-center gap-10">
        
        {/* Left Side: Content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#EF4444]/10 border border-[#EF4444]/50 text-[#EF4444] text-[10px] font-orbitron font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Market Surveillance
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-orbitron font-black text-[#F8FAFC] leading-[1.1] tracking-tighter mb-6 uppercase">
            Track Free PC Games & <br className="hidden lg:block"/>
            Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] via-[#8B5CF6] to-[#EC4899] glow-text drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">Deal Intel</span>
          </h1>
          
          <p className="text-[#94A3B8] text-base sm:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 font-poppins leading-relaxed border-l-4 border-[#06B6D4]/50 pl-4 bg-[#050816]/40 p-2 rounded-r-lg">
            Real-time surveillance of Steam, Epic Games, GOG, Humble Bundle, Fanatical, and upcoming gaming price anomalies.
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10">
            <button 
              onClick={onExploreClick}
              className="px-6 py-3 rounded-sm relative overflow-hidden bg-[#8B5CF6]/10 border border-[#8B5CF6] text-[#F8FAFC] font-orbitron font-bold uppercase tracking-widest text-xs hover:bg-[#8B5CF6] hover:text-[#050816] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-2 group">
              <span className="absolute inset-0 w-1/4 h-full bg-white/20 -skew-x-12 -translate-x-[150%] group-hover:animate-[wave_1s_ease-in-out_infinite]"></span>
              <Crosshair className="w-4 h-4" /> Access Intel
            </button>
            <button 
              onClick={onFreeGamesClick}
              className="px-6 py-3 rounded-sm bg-[#06B6D4]/10 border border-[#06B6D4]/50 text-[#06B6D4] hover:bg-[#06B6D4] hover:text-[#050816] font-orbitron font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Radar className="w-4 h-4" /> Scan Free Games
            </button>
            <button 
              onClick={onTrendingClick}
              className="px-6 py-3 rounded-sm bg-transparent border border-[#94A3B8]/30 hover:border-[#F8FAFC] text-[#94A3B8] hover:text-[#F8FAFC] font-orbitron font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8B5CF6]" /> View Upcoming Drops
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-orbitron text-[#06B6D4] border-t border-white/5 pt-6 bg-black/20 backdrop-blur-md rounded-lg mx-auto lg:mx-0 p-4 w-full text-center lg:text-left">
            <div className="flex flex-col">
              <span className="text-xl font-bold font-sans text-white">15+</span>
              <span className="uppercase tracking-widest mt-1 opacity-70">Storefronts Sync'd</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-sans text-white">90M+</span>
              <span className="uppercase tracking-widest mt-1 opacity-70">Historical Price Nodes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-sans text-white">24/7</span>
              <span className="uppercase tracking-widest mt-1 text-[#8B5CF6] opacity-90">Market Surveillance</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-sans text-white">99.8%</span>
              <span className="uppercase tracking-widest mt-1 text-[#22C55E] opacity-90">Extraction Efficiency</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Telemetry / Live Feed */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex w-full max-w-[320px] flex-col items-stretch justify-center relative"
        >
          <div className="relative bg-[#0F172A]/80 border border-[#06B6D4]/30 rounded-xl p-5 overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] group font-mono text-xs">
             <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10 text-[#94A3B8]">
                <div className="flex items-center gap-2">
                   <Terminal className="w-4 h-4 text-[#06B6D4]" />
                   <span className="uppercase tracking-wider font-bold">Live Telemetry</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
             </div>
             
             <div className="flex flex-col gap-3 min-h-[120px] justify-start">
               <AnimatePresence mode="popLayout">
                  <motion.div
                    key={msgIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3 }}
                    className="text-[#06B6D4] font-bold tracking-widest flex items-center gap-2"
                  >
                    <span className="text-[#8B5CF6]">&gt;</span> {FEED_MESSAGES[msgIndex]}
                  </motion.div>
                  <motion.div
                    key={`${msgIndex}-history`}
                    className="text-white/30 tracking-widest flex items-center gap-2 line-through"
                  >
                    <span className="text-white/10">&gt;</span> {FEED_MESSAGES[(msgIndex - 1 + FEED_MESSAGES.length) % FEED_MESSAGES.length]}
                  </motion.div>
               </AnimatePresence>
             </div>

             {/* Animated Progress Bar */}
             <div className="mt-4 pt-4 border-t border-white/10">
               <div className="flex justify-between text-[9px] text-[#94A3B8] uppercase tracking-widest mb-1">
                 <span>System Load</span>
                 <span className="text-[#EC4899]">OPTIMAL</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] w-[45%] animate-[pulse_2s_ease-in-out_infinite]"></div>
               </div>
             </div>
          </div>
        </motion.div>


      </div>

    </div>
  );
}


