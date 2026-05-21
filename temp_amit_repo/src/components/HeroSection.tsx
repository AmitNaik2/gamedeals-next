import { motion } from "motion/react";
import { Sparkles, TrendingUp } from "lucide-react";

const PARTICLES = Array.from({ length: 15 }, (_, index) => {
  const seed = index + 1;
  return {
    width: (seed * 7) % 4 + 1,
    height: (seed * 11) % 4 + 1,
    left: (seed * 37) % 100,
    top: (seed * 53) % 100,
    duration: ((seed * 17) % 30) / 10 + 2,
    delay: ((seed * 13) % 20) / 10,
  };
});

export function HeroSection({ onExploreClick, onTrendingClick }: { onExploreClick?: () => void, onTrendingClick?: () => void }) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-black border border-white/10 mb-12 min-h-[400px] flex items-center">
      {/* Background Gradients & Particles */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/20 via-black to-cyan-500/10"></div>
      
      {/* Animated Floating Particles Mock */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/20 rounded-full blur-[1px]"
            style={{
              width: particle.width + "px",
              height: particle.height + "px",
              left: particle.left + "%",
              top: particle.top + "%",
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 1, 0.2]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
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
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Updated Hourly
            </span>
            <span className="text-[10px] font-mono text-white/50 uppercase">
              Last updated: {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }).format(new Date())}
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Track Free PC Games <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-cyan-400 glow-text">Before They Expire</span>
          </h2>
          
          <p className="text-white/60 text-lg mb-6 max-w-xl">
            Track the best free games from official stores like Steam, Epic Games, and GOG. Don't miss out on premium AAA giveaways.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-white/50 text-sm font-medium">
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Official Store Links Only</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Verified Giveaways</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> No Piracy</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
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

          <form className="flex w-full max-w-sm items-center gap-2 mb-4" onSubmit={async (e) => { 
            e.preventDefault(); 
            const emailInput = (e.target as HTMLFormElement).querySelector('input[type="email"]') as HTMLInputElement;
            const email = emailInput.value;
            if(!email) return;
            try {
              const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              if(res.ok) {
                 alert('Subscribed successfully!');
                 emailInput.value = '';
              } else {
                 alert('Failed to subscribe. Please try again.');
              }
            } catch(err) {
              alert('Error subscribing. Try again later.');
            }
          }}>
            <input type="email" placeholder="Enter your email" required className="flex-1 h-10 px-4 rounded border border-white/20 bg-black/50 text-white placeholder:text-white/40 focus:outline-none focus:border-[#7C3AED] transition-colors" />
            <button type="submit" className="h-10 px-4 rounded bg-[#7C3AED] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#6D28D9] transition-colors">
              Notify Me
            </button>
          </form>

          <div className="flex items-center gap-6 text-sm font-mono text-white/50 border-t border-white/10 pt-6 mt-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">450K+</span>
              <span className="text-[10px] uppercase tracking-widest">Games Claimed</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">100+</span>
              <span className="text-[10px] uppercase tracking-widest">Deals Tracked</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative right side graphic (hidden on mobile) */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#7C3AED]/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
