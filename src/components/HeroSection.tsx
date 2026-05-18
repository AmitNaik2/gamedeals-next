import { motion } from "motion/react";
import { Sparkles, TrendingUp } from "lucide-react";

export function HeroSection({ onExploreClick, onTrendingClick }: { onExploreClick?: () => void, onTrendingClick?: () => void }) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-black border border-white/10 mb-12 min-h-[400px] flex items-center">
      {/* Background Gradients & Particles */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/20 via-black to-cyan-500/10"></div>
      
      {/* Animated Floating Particles Mock */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/20 rounded-full blur-[1px]"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 1, 0.2]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" /> Updated Daily
          </span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Track Free PC Games <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-cyan-400 glow-text">Before They Expire</span>
          </h2>
          
          <p className="text-white/60 text-lg mb-8 max-w-xl">
            Steam, Epic Games, GOG, Prime Gaming & more. Don't miss out on premium AAA gaming deals.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={onExploreClick}
              className="px-6 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Explore Deals
            </button>
            <button 
              onClick={onTrendingClick}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Trending Games
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative right side graphic (hidden on mobile) */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#7C3AED]/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
