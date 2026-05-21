import { motion } from "motion/react";
import { Sparkles, TrendingUp, Gamepad2, PlaySquare, Search } from "lucide-react";

const PARTICLES = Array.from({ length: 40 }, (_, index) => {
  const seed = index + 1;
  return {
    width: (seed * 7) % 4 + 1,
    height: (seed * 11) % 4 + 1,
    left: (seed * 37) % 100,
    top: (seed * 53) % 100,
    duration: ((seed * 17) % 30) / 10 + 2,
    delay: ((seed * 13) % 20) / 10,
    color: index % 3 === 0 ? "bg-cyan-400" : index % 3 === 1 ? "bg-purple-500" : "bg-pink-500"
  };
});

export function HeroSection({ onExploreClick, onTrendingClick, onFreeGamesClick }: { onExploreClick?: () => void, onTrendingClick?: () => void, onFreeGamesClick?: () => void }) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#070B14] border border-white/5 mb-12 min-h-[500px] flex items-center shadow-[0_0_50px_rgba(139,92,246,0.1)] group">
      {/* Background Gradients & Particles */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#070B14] via-[#111827] to-[#1e1b4b]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-60"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

      {/* Animated Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[2px] ${particle.color} opacity-30`}
            style={{
              width: particle.width + "px",
              height: particle.height + "px",
              left: particle.left + "%",
              top: particle.top + "%",
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: particle.duration * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-4xl mx-auto text-center lg:text-left lg:mx-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Sparkles className="w-3.5 h-3.5" /> Premium Gaming Drops
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-orbitron font-bold text-white leading-tight tracking-tight mb-6">
            Track the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#06B6D4] glow-text filter drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">PC Game Deals</span> <br className="hidden lg:block"/>
            & Free Giveaways
          </h1>
          
          <p className="text-[#9CA3AF] text-lg sm:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 font-poppins font-light leading-relaxed">
            Steam discounts, Epic Games giveaways, exclusive promo codes, and verified premium drops updated in real time.
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
            <button 
              onClick={onExploreClick}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-poppins font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2">
              <Search className="w-5 h-5" /> Browse Deals
            </button>
            <button 
              onClick={onFreeGamesClick || onExploreClick}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-poppins font-bold uppercase tracking-widest text-sm hover:bg-white/10 hover:border-white/30 transition-colors backdrop-blur-md flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#22C55E]" /> Free Games
            </button>
            <button 
              onClick={onTrendingClick}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-poppins font-bold uppercase tracking-widest text-sm hover:bg-white/10 hover:border-[#EC4899]/50 transition-colors backdrop-blur-md flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#EC4899]" /> Trending
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm font-orbitron text-[#9CA3AF] border-t border-white/5 pt-8 mt-4 glass-panel rounded-2xl p-6 bg-black/20 backdrop-blur-md">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-3xl font-bold font-sans text-white glow-text">5000+</span>
              <span className="text-[10px] text-[#06B6D4] font-bold uppercase tracking-widest mt-1">Deals Tracked</span>
            </div>
            <div className="hidden sm:block w-px h-12 border-r border-white/5 mx-auto"></div>
            <div className="flex flex-col items-center lg:items-start pl-0 lg:pl-4 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
              <span className="text-3xl font-bold font-sans text-white glow-text">Hourly</span>
              <span className="text-[10px] text-[#8B5CF6] font-bold uppercase tracking-widest mt-1">Real-time Updates</span>
            </div>
            <div className="hidden sm:block w-px h-12 border-r border-white/5 mx-auto"></div>
            <div className="flex flex-col items-center lg:items-start pl-0 lg:pl-4 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
              <span className="text-3xl font-bold font-sans text-white glow-text">Multi</span>
              <span className="text-[10px] text-[#EC4899] font-bold uppercase tracking-widest mt-1">Steam + Epic + GOG</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative right side graphic */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
         <div className="absolute right-[-10%] top-[10%] w-[600px] h-[600px] bg-[#8B5CF6]/20 rounded-full blur-[100px] mix-blend-screen mix-blend-lighten animate-pulse" style={{ animationDuration: '4s' }}></div>
         <div className="absolute right-[20%] bottom-[-10%] w-[400px] h-[400px] bg-[#06B6D4]/20 rounded-full blur-[100px] mix-blend-screen mix-blend-lighten animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
