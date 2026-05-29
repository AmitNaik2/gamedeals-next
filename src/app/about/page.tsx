"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { Crosshair, Target, Cpu, Zap, Activity, Gamepad2, ChevronRight, ShieldCheck } from 'lucide-react';
import { LegalLayout } from '@/components/LegalLayout';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const features = [
    {
      icon: <Gamepad2 className="w-5 h-5" />,
      title: "Free Game Tracking",
      desc: "Real-time monitoring of 100% free giveaways across Steam, Epic Games, GOG, and Prime Gaming."
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Low-End PC Gaming",
      desc: "Curated selections and performance settings for gamers playing on budget laptops or older hardware."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Optimization Guides",
      desc: "Actionable intelligence on squeezing maximum FPS and stability out of your current rig."
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Deal Monitoring",
      desc: "Automated historical low tracking and prediction engines for upcoming publisher sales."
    }
  ];

  return (
    <LegalLayout 
      title="About Us" 
      subtitle="The Hub for Gaming Intelligence" 
      icon={<Crosshair className="w-8 h-8" />}
      accentTheme="cyan"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {/* Intro Panel */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#06B6D4]/20 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
          <div className="bg-[#0F172A]/80 backdrop-blur-xl border-l-4 border-l-[#06B6D4] border-t border-r border-b border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/10 blur-[50px] mix-blend-screen pointer-events-none"></div>
            <p className="text-lg md:text-xl text-white font-medium leading-relaxed mb-4">
              Welcome to <span className="text-[#06B6D4] font-orbitron font-bold tracking-wider">GamesDealsHub</span> — a platform built for gamers who love discovering free games, gaming deals, low-end PC optimization tips, and useful gaming content without wasting time searching across multiple websites.
            </p>
            <p className="text-[#9CA3AF] text-sm md:text-base leading-relaxed">
              GamesDealsHub was created by Amit with a simple goal: <strong className="text-white">make gaming deals and useful gaming information easier to access for everyone.</strong>
            </p>
          </div>
        </motion.div>

        {/* Why We Exist */}
        <motion.div variants={itemVariants} className="bg-[#050816]/60 border border-white/5 rounded-2xl p-8 relative group">
          <h2 className="flex items-center gap-3 text-xl font-orbitron font-bold text-white uppercase tracking-widest mb-6">
            <Target className="w-5 h-5 text-[#8B5CF6]" /> Why GamesDealsHub Exists
          </h2>
          <p className="text-[#9CA3AF] leading-relaxed mb-8">
            We understand that not every gamer owns a high-end gaming PC. Many players use budget laptops, older desktops, or entry-level setups. That's why we focus heavily on leveling the playing field.
          </p>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#06B6D4]/40 hover:bg-[#06B6D4]/5 transition-all duration-300 group/card">
                <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-white/10 flex items-center justify-center text-[#9CA3AF] group-hover/card:text-[#06B6D4] group-hover/card:border-[#06B6D4]/30 group-hover/card:shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-4 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-sm font-orbitron font-bold text-white uppercase tracking-wider mb-2">{feat.title}</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4 glow-text-purple">Our Mission</h2>
            <ul className="space-y-3">
              {[
                "Save money on premium titles",
                "Discover fun indie gems",
                "Improve system performance",
                "Stay updated on limited-time offers"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#9CA3AF] group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#8B5CF6]" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-center relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <ShieldCheck className="w-16 h-16 text-[#22C55E]" />
             </div>
             <h2 className="text-lg font-orbitron font-bold text-[#22C55E] uppercase tracking-widest mb-4">Authority & Sourcing</h2>
             <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
               All intelligence on <strong className="text-white">GamesDealsHub</strong> is systematically verified. We utilize direct API endpoints from official storefronts including the <strong className="text-white">Epic Games GraphQL API</strong>, <strong className="text-white">Steamworks API</strong>, and <strong className="text-white">GOG API</strong> to ensure 100% accuracy.
             </p>
             <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
               Founded by <strong className="text-white">Amit Naik</strong>, our platform prioritizes strict data integrity. No fake giveaways, no malware links, just direct paths to official game clients.
             </p>
             <Link href="/contact" className="w-full py-3 bg-white/5 hover:bg-[#06B6D4]/20 border border-white/10 hover:border-[#06B6D4]/50 rounded-xl text-center text-xs font-orbitron font-bold text-white hover:text-[#06B6D4] uppercase tracking-widest transition-all shadow-[0_0_0_rgba(6,182,212,0)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] mt-auto z-10">
                Initialize Contact Protocol
             </Link>
          </div>
        </motion.div>

      </motion.div>
    </LegalLayout>
  );
}
