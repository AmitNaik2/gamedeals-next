"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Radar, ScanLine, Terminal, Activity, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export function HeroSection({ onExploreClick, onTrendingClick, onFreeGamesClick }: { onExploreClick?: () => void, onTrendingClick?: () => void, onFreeGamesClick?: () => void }) {
  const [sequenceState, setSequenceState] = useState(0);

  useEffect(() => {
    // Check if we've already played the intro in this session
    const hasPlayed = sessionStorage.getItem("hero_intro_played");
    if (hasPlayed) {
      setSequenceState(2);
      return;
    }

    // Sequence timing
    const t1 = setTimeout(() => setSequenceState(1), 1500); // 1.5s init
    const t2 = setTimeout(() => {
        setSequenceState(2);
        sessionStorage.setItem("hero_intro_played", "true");
    }, 6000); // 4.5s flight -> lock-in at 6s total

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden bg-[#02040A] border border-[#06B6D4]/20 mb-12 h-[600px] flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] group" 
      style={{ perspective: '1200px' }}
    >
      {/* Universal Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#02040A] via-[#050B14] to-[#1e1b4b]"></div>
      
      {/* 3D Cyber Grid Floor (Always there, but animates opacity/speed) */}
      <div className={cn(
          "absolute inset-0 z-0 origin-bottom transition-opacity duration-1000 pointer-events-none",
          sequenceState === 0 ? "opacity-0" : "opacity-40"
      )}
      style={{ transform: "rotateX(60deg) scale(2.5) translateY(30%)" }}>
          {/* Animated Grid SVG using arbitrary values for animation */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHBhdGggZD0iTTAgMGg4MHY4MEgwem03OSA3OUgxVjFoNzh6IiBmaWxsPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjIpIi8+PC9zdmc+')] [background-size:80px_80px] animate-[slide-down_5s_linear_infinite]"></div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slide-down {
              from { background-position: 0 0; }
              to { background-position: 0 80px; }
            }
          `}} />
          
          {/* Floor Glow */}
          {sequenceState > 0 && <div className="absolute inset-0 bg-gradient-to-t from-[#06B6D4]/30 to-transparent"></div>}
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 0: Initialization */}
        {sequenceState === 0 && (
          <motion.div 
            key="stage0"
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.5 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center font-mono text-[#06B6D4]"
          >
             <Terminal className="w-12 h-12 mb-6 animate-pulse opacity-50" />
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0.5, 1] }}
                transition={{ duration: 0.8 }}
                className="text-xs sm:text-sm md:text-base tracking-[0.2em] md:tracking-[0.3em] font-bold uppercase glow-text text-center px-4"
             >
                Initializing Digital Command Center...
             </motion.div>
             <div className="w-64 h-1 bg-white/10 mt-8 overflow-hidden rounded-full">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "linear" }}
                    className="h-full bg-[#06B6D4] shadow-[0_0_15px_#06B6D4]"
                 ></motion.div>
             </div>
          </motion.div>
        )}

        {/* STAGE 1: Cinematic Flight */}
        {sequenceState === 1 && (
           <motion.div 
             key="stage1"
             initial={{ opacity: 0, z: -1000 }}
             animate={{ opacity: 1, z: 800 }}
             exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
             transition={{ duration: 4.5, ease: "easeInOut" }}
             className="absolute inset-0 z-10 flex items-center justify-center transform-gpu [transform-style:preserve-3d] pointer-events-none"
           >
              {/* Floating Hologram Panel 1 */}
              <motion.div 
                className="absolute left-[5%] md:left-[10%] top-[20%] w-40 md:w-56 h-64 border border-[#06B6D4]/50 bg-[#06B6D4]/10 backdrop-blur-xl rounded-xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                style={{ transform: "rotateY(-30deg) translateZ(-200px)" }}
              >
                  <div className="h-6 w-1/2 bg-[#06B6D4]/50 rounded mb-6 animate-pulse"></div>
                  <div className="flex gap-2 mb-4">
                     <div className="h-16 w-16 bg-white/10 rounded"></div>
                     <div className="flex-1 flex flex-col gap-2">
                         <div className="h-2 w-full bg-white/20 rounded"></div>
                         <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                     </div>
                  </div>
                  <div className="h-2 w-full bg-[#06B6D4]/30 rounded mb-2"></div>
                  <div className="h-2 w-full bg-[#06B6D4]/30 rounded"></div>
                  <div className="absolute bottom-4 right-4 text-[#06B6D4] font-mono text-[8px] md:text-[10px] uppercase tracking-widest font-bold">TRACK FREE GAMES</div>
              </motion.div>
              
              {/* Floating Hologram Panel 2 */}
              <motion.div 
                className="absolute right-[5%] md:right-[10%] top-[10%] w-48 md:w-64 h-48 border border-[#8B5CF6]/50 bg-[#8B5CF6]/10 backdrop-blur-xl rounded-xl p-4 shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                style={{ transform: "rotateY(30deg) translateZ(-400px)" }}
              >
                  <Activity className="w-8 h-8 text-[#8B5CF6] mb-6 animate-pulse drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                  <div className="h-2 w-full bg-[#8B5CF6]/50 rounded mb-3"></div>
                  <div className="h-2 w-5/6 bg-[#8B5CF6]/40 rounded mb-3"></div>
                  <div className="h-2 w-4/6 bg-white/20 rounded"></div>
                  <div className="absolute bottom-4 right-4 text-[#8B5CF6] font-mono text-[8px] md:text-[10px] uppercase tracking-widest font-bold">LIVE DEAL INTEL</div>
              </motion.div>

              {/* Floating Hologram Panel 3 */}
              <motion.div 
                className="absolute left-[20%] bottom-[10%] w-48 md:w-72 h-36 border border-[#EC4899]/50 bg-[#EC4899]/10 backdrop-blur-xl rounded-xl p-4 shadow-[0_0_40px_rgba(236,72,153,0.4)]"
                style={{ transform: "rotateY(-15deg) rotateX(15deg) translateZ(-100px)" }}
              >
                 <ScanLine className="w-6 h-6 text-[#EC4899] mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                 <div className="flex justify-between items-end h-12 gap-2">
                     <div className="w-full bg-[#EC4899]/40 rounded-t h-full animate-[pulse_1s_ease-in-out_infinite]"></div>
                     <div className="w-full bg-[#EC4899]/30 rounded-t h-4/5"></div>
                     <div className="w-full bg-white/20 rounded-t h-3/5"></div>
                     <div className="w-full bg-[#EC4899]/50 rounded-t h-full"></div>
                 </div>
                 <div className="absolute top-4 right-4 text-[#EC4899] font-mono text-[8px] md:text-[10px] uppercase tracking-widest font-bold">LOW-END PC OPTIMIZATION</div>
              </motion.div>

              {/* Center Flash Text 1 */}
              <motion.h2 
                initial={{ opacity: 0, scale: 0.5, letterSpacing: "5px" }}
                animate={{ opacity: [0, 1, 0], scale: 1.5, letterSpacing: "30px" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute text-2xl md:text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/0 z-20 whitespace-nowrap drop-shadow-[0_0_20px_white]"
              >
                REAL-TIME GIVEAWAYS
              </motion.h2>

              {/* Center Flash Text 2 */}
              <motion.h2 
                initial={{ opacity: 0, scale: 0.5, letterSpacing: "5px" }}
                animate={{ opacity: [0, 1, 0], scale: 2, letterSpacing: "40px" }}
                transition={{ duration: 1.5, delay: 2.5 }}
                className="absolute text-2xl md:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] via-[#8B5CF6] to-[#EC4899] z-20 whitespace-nowrap drop-shadow-[0_0_30px_#8B5CF6]"
              >
                SYSTEM ONLINE
              </motion.h2>

              {/* Cinematic Particle Streaks (Speed Lines) */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                   <motion.div 
                     key={i}
                     initial={{ top: "-10%", left: `${Math.random() * 100}%`, height: "20px", opacity: 0 }}
                     animate={{ top: "110%", height: "200px", opacity: [0, 1, 0] }}
                     transition={{ duration: 0.5 + Math.random() * 1, repeat: Infinity, delay: Math.random() * 2 }}
                     className="absolute w-0.5 bg-gradient-to-b from-transparent via-[#06B6D4] to-transparent shadow-[0_0_10px_#06B6D4]"
                   />
                ))}
              </div>
           </motion.div>
        )}

        {/* STAGE 2: Lock-in */}
        {sequenceState === 2 && (
           <motion.div 
             key="stage2"
             initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
             animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
             transition={{ duration: 1.2, ease: "easeOut" }}
             className="relative z-20 flex flex-col items-center text-center px-4 w-full"
           >
              {/* Logo Neon Bloom Aura */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[150px] bg-gradient-to-r from-[#06B6D4] via-[#8B5CF6] to-[#EC4899] blur-[80px] md:blur-[120px] opacity-40 mix-blend-screen pointer-events-none"></div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-orbitron font-black text-white tracking-tighter mb-4 glow-text drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] flex flex-col md:flex-row items-center gap-2 md:gap-6"
              >
                <div className="relative">
                   <div className="absolute inset-0 bg-[#06B6D4] blur-[30px] opacity-50 animate-pulse rounded-full"></div>
                   <Zap className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[#06B6D4] relative z-10" />
                </div>
                <span>GamesDealsHub</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, letterSpacing: "0px" }}
                animate={{ opacity: 1, letterSpacing: typeof window !== 'undefined' && window.innerWidth > 768 ? "12px" : "4px" }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                className="text-[#94A3B8] font-mono text-[10px] sm:text-xs md:text-sm uppercase mb-16 shadow-black drop-shadow-md mr-[-4px] md:mr-[-12px]"
              >
                Gaming Deal Intelligence Network
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.6, type: "spring", bounce: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                 <button 
                  onClick={() => {
                     if (onFreeGamesClick) onFreeGamesClick();
                  }}
                  className="relative group overflow-hidden rounded-sm bg-[#050816]/80 backdrop-blur-md border-2 border-[#06B6D4] px-8 md:px-12 py-4 md:py-5 flex items-center gap-4 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
                 >
                    {/* Button Glitch/Glow bg */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#06B6D4]/10 to-[#8B5CF6]/10 group-hover:from-[#06B6D4]/30 group-hover:to-[#8B5CF6]/30 transition-colors duration-500"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-[#06B6D4]/80 to-transparent -translate-x-[150%] group-hover:animate-[wave_1.5s_ease-in-out_infinite] blur-md"></div>
                    
                    <Radar className="w-5 h-5 md:w-6 md:h-6 text-[#06B6D4] group-hover:text-white relative z-10 animate-spin-slow drop-shadow-[0_0_10px_#06B6D4]" />
                    <span className="font-orbitron font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#06B6D4] group-hover:text-white relative z-10 text-sm md:text-base drop-shadow-md">
                      Scan Free Games
                    </span>
                 </button>
                 
                 <button 
                  onClick={onTrendingClick}
                  className="px-6 py-4 rounded-sm border border-transparent hover:border-white/20 text-[#94A3B8] hover:text-white font-orbitron font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2"
                 >
                   View Upcoming Drops
                 </button>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


