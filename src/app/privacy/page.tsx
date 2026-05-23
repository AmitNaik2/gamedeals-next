"use client";

import { motion } from 'motion/react';
import { Shield, Lock, Eye, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import { LegalLayout } from '@/components/LegalLayout';

export default function PrivacyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <LegalLayout 
      title="Privacy Policy" 
      subtitle="Data Protection & Security Protocol" 
      icon={<Shield className="w-8 h-8" />}
      accentTheme="purple"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
          <span className="px-3 py-1 bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 rounded-md text-[#8B5CF6] text-xs font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            Last Updated: May 2026
          </span>
          <span className="text-[#9CA3AF] text-sm">v2.4.1</span>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[#0F172A]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl mb-8">
          <p className="text-[#9CA3AF] leading-relaxed">
            At <span className="text-white font-orbitron font-bold">GamesDealsHub</span>, your privacy is paramount. This Privacy Policy details how our systems collect, process, and encrypt your digital footprint.
          </p>
        </motion.div>

        {/* Section 1 */}
        <motion.div variants={itemVariants} className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md"></div>
          <div className="bg-[#050816]/80 backdrop-blur-xl border-l-4 border-l-[#8B5CF6] border-t border-r border-b border-white/5 rounded-2xl p-6 relative z-10 transition-all duration-300 group-hover:border-t-white/10 group-hover:border-r-white/10 group-hover:border-b-white/10">
            <h2 className="flex items-center gap-3 text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4">
              <Database className="w-5 h-5 text-[#8B5CF6]" /> Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-3">System Telemetry</p>
                <ul className="space-y-2">
                  {['Basic analytics information', 'Browser & device telemetry', 'Pages visited', 'Cookies and usage data'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#E2E8F0]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-3">Direct Contact</p>
                <ul className="space-y-2">
                  {['Your email address', 'Messages you send us'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#E2E8F0]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-4 flex items-start gap-3 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
               <Lock className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
               <div>
                 <p className="text-[#22C55E] font-bold font-orbitron tracking-widest uppercase text-sm">Absolute Protocol</p>
                 <p className="text-white text-sm">We do not sell personal information to third-party data brokers under any circumstances.</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2 */}
        <motion.div variants={itemVariants} className="group relative">
          <div className="bg-[#050816]/80 backdrop-blur-xl border-l-4 border-l-[#8B5CF6] border-t border-r border-b border-white/5 rounded-2xl p-6 relative z-10 transition-all duration-300">
            <h2 className="flex items-center gap-3 text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4">
              <Eye className="w-5 h-5 text-[#8B5CF6]" /> Cookies
            </h2>
            <p className="text-[#9CA3AF] text-sm mb-4">GamesDealsHub utilizes functional tracking cookies to:</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {['Improve website performance', 'Remember preferences', 'Analyze traffic', 'Display relevant advertisements'].map((item, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-[#E2E8F0]">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#9CA3AF] border-t border-white/5 pt-4 mt-2">You can disable cookies directly via your browser's security settings.</p>
          </div>
        </motion.div>

        {/* Section 3 & 4 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="bg-[#050816]/80 backdrop-blur-xl border-l-4 border-l-[#06B6D4] border-t border-r border-b border-white/5 rounded-2xl p-6 hover:border-[#06B6D4]/30 transition-colors">
            <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-widest mb-4">Third-Party Services</h2>
            <ul className="space-y-2 mb-4">
              {['Google Analytics', 'Google AdSense', 'Steam/Epic Games APIs', 'External affiliate services'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#E2E8F0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]"></span> {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#9CA3AF]">These services may collect information according to their own privacy policies.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#050816]/80 backdrop-blur-xl border-l-4 border-l-[#EC4899] border-t border-r border-b border-white/5 rounded-2xl p-6 hover:border-[#EC4899]/30 transition-colors">
            <h2 className="text-base font-orbitron font-bold text-white uppercase tracking-widest mb-4">Advertising Networks</h2>
            <p className="text-sm text-[#E2E8F0] mb-4">
              Third-party vendors, including Google, may use cookies to serve ads based on your previous visits to this website or other websites.
            </p>
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#EC4899]/10 border border-[#EC4899]/30 rounded-lg text-xs font-bold text-[#EC4899] hover:bg-[#EC4899] hover:text-white transition-all">
              Google Advertising Policies
            </a>
          </motion.div>
        </div>

        {/* Bottom Small Sections */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-xs font-orbitron font-bold text-[#8B5CF6] uppercase tracking-widest mb-2 flex items-center gap-2"><Lock className="w-3 h-3" /> Data Security</h3>
            <p className="text-xs text-[#9CA3AF]">We work to protect your information, but no online platform can guarantee complete security.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-xs font-orbitron font-bold text-[#8B5CF6] uppercase tracking-widest mb-2 flex items-center gap-2"><Eye className="w-3 h-3" /> Children's Privacy</h3>
            <p className="text-xs text-[#9CA3AF]">GamesDealsHub does not knowingly collect personal information from children under 13.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-xs font-orbitron font-bold text-[#8B5CF6] uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Policy Updates</h3>
            <p className="text-xs text-[#9CA3AF]">We may update this Privacy Policy at any time. Changes will be posted on this page.</p>
          </div>
        </motion.div>

      </motion.div>
    </LegalLayout>
  );
}
