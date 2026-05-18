import { motion } from "motion/react";
import { Gamepad2, Search, Bell, Heart, User, MessageSquare } from "lucide-react";

export function TopNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-2xl border-b border-white/10">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 hidden sm:block delay-100">
              GameDeals<span className="text-[#7C3AED]">Hub</span>
            </h1>
          </div>

          {/* Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="#" className="text-sm font-bold text-white hover:text-[#7C3AED] transition-colors">Home</a>
            <a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Free Games</a>
            <a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Free Weekends</a>
            <a href="#" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Trending</a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative group">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-[#7C3AED] transition-colors" />
              <input 
                type="text"
                placeholder="Search games..."
                className="w-48 xl:w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all placeholder:text-white/30"
              />
            </div>

            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all">
              <MessageSquare className="w-4 h-4 fill-current" />
            </button>
            <button className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white/70 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse"></span>
            </button>

            <div className="flex items-center gap-2 pl-3 ml-1 border-l border-white/10 shrink-0">
               <button className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white/70">
                 <User className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
