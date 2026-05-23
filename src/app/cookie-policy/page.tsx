"use client";

import { motion } from 'motion/react';
import { Database, Cookie, ToggleRight, Search, Zap, LayoutDashboard, Settings, AlertTriangle } from 'lucide-react';
import { LegalLayout } from '@/components/LegalLayout';

export default function CookiePolicyPage() {
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

  const cookieTypes = [
    {
      icon: <Search className="w-5 h-5" />,
      name: "Traffic Analysis",
      color: "text-[#06B6D4]",
      border: "border-[#06B6D4]/30",
      bg: "bg-[#06B6D4]/10",
      desc: "Helps us understand how visitors interact with the platform by collecting and reporting information anonymously."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      name: "Performance",
      color: "text-[#8B5CF6]",
      border: "border-[#8B5CF6]/30",
      bg: "bg-[#8B5CF6]/10",
      desc: "Used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience."
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Preferences",
      color: "text-[#EC4899]",
      border: "border-[#EC4899]/30",
      bg: "bg-[#EC4899]/10",
      desc: "Enables the website to remember information that changes the way the website behaves or looks, like your preferred region."
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Advertising",
      color: "text-[#22C55E]",
      border: "border-[#22C55E]/30",
      bg: "bg-[#22C55E]/10",
      desc: "Used to provide visitors with customized advertisements based on the pages you visited previously and to analyze the effectiveness of the campaigns."
    }
  ];

  return (
    <LegalLayout 
      title="Cookie Policy" 
      subtitle="Local Storage & Session Tracking" 
      icon={<Database className="w-8 h-8" />}
      accentTheme="pink"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-end border-b border-white/10 pb-4">
          <span className="px-3 py-1 bg-[#EC4899]/10 border border-[#EC4899]/30 rounded-md text-[#EC4899] text-xs font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(236,72,153,0.15)]">
            Last Updated: May 2026
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[#0F172A]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4899]/10 blur-[50px] mix-blend-screen pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-[#EC4899]/20"></div>
          <div className="flex items-center gap-4 mb-4">
            <Cookie className="w-8 h-8 text-[#EC4899]" />
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">What Are Cookies?</h2>
          </div>
          <p className="text-lg text-white font-medium mb-2">
            <span className="text-[#06B6D4] font-orbitron tracking-wider">GamesDealsHub</span> uses cookies to improve user experience and website functionality.
          </p>
          <p className="text-[#9CA3AF] leading-relaxed">
            Cookies are small cryptographic files stored on your local device that help our servers remember session information, authentication tokens, and interface preferences about your visit.
          </p>
        </motion.div>

        {/* Cookie Types Grid */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <ToggleRight className="w-5 h-5 text-[#06B6D4]" /> Cookie Implementation Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cookieTypes.map((type, idx) => (
              <div key={idx} className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-xl p-5 hover:border-white/20 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${type.bg} ${type.border} border shadow-[0_0_10px_rgba(255,255,255,0.05)]`}>
                    {type.icon}
                  </div>
                  {/* Modern Toggle Switch Mock */}
                  <div className="w-10 h-5 rounded-full bg-[#0F172A] border border-white/10 relative cursor-not-allowed">
                    <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]"></div>
                  </div>
                </div>
                <h3 className={`text-sm font-orbitron font-bold uppercase tracking-wider mb-2 ${type.color}`}>{type.name}</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Third Party & Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative">
            <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-widest mb-4">Third-Party Cookies</h2>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
              Authorized third-party services such as Google AdSense and analytics providers may also inject cookies to function correctly.
            </p>
            <div className="h-1 w-full bg-gradient-to-r from-[#EC4899]/50 to-transparent rounded-full opacity-50"></div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6">
            <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-widest mb-4">Managing Cookies</h2>
            <p className="text-[#9CA3AF] text-sm mb-4">Through your browser's security settings, you can:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Disable Cookies', 'Delete Cookies', 'Control Permissions'].map((item, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs font-mono text-[#E2E8F0] uppercase tracking-wider">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Warning Panel */}
        <motion.div variants={itemVariants} className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-6 flex items-start gap-4 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <AlertTriangle className="w-6 h-6 text-[#F59E0B] shrink-0 mt-1" />
          <div>
            <h3 className="text-[#F59E0B] font-orbitron font-bold uppercase tracking-widest mb-1">Warning: Disabling Cookies</h3>
            <p className="text-[#E2E8F0] text-sm">
              Disabling core cookies may severely affect website functionality, break authentication sessions, and degrade the user interface experience.
            </p>
          </div>
        </motion.div>

      </motion.div>
    </LegalLayout>
  );
}
