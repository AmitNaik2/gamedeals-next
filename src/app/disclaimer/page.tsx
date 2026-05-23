"use client";

import { motion } from 'motion/react';
import Link from 'next/link';
import { AlertOctagon, TrendingDown, HelpCircle, ExternalLink, Copyright, Mail, AlertTriangle } from 'lucide-react';
import { LegalLayout } from '@/components/LegalLayout';

export default function DisclaimerPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <LegalLayout 
      title="Disclaimer" 
      subtitle="Critical System Notices & Liabilities" 
      icon={<AlertOctagon className="w-8 h-8" />}
      accentTheme="green" // We'll use custom amber/yellow overrides for warnings in this specific page, or stick to the layout's theme. Let's stick to green for base layout, but use Amber inside. Wait, I added green to LegalLayout, let's just use it, and have amber inside.
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-end border-b border-white/10 pb-4">
          <span className="px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-md text-[#22C55E] text-xs font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(34,197,94,0.15)]">
            Last Updated: May 2026
          </span>
        </motion.div>

        {/* Main Notice */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#F59E0B]/20 to-transparent border-l-4 border-l-[#F59E0B] border-t border-r border-b border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#F59E0B]/10 blur-[50px] mix-blend-screen pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
            <h2 className="text-xl font-orbitron font-bold text-[#F59E0B] uppercase tracking-widest">General Information Notice</h2>
          </div>
          <p className="text-white font-medium text-lg mb-2">
            The information provided on <span className="text-[#06B6D4] font-orbitron tracking-wider">GamesDealsHub</span> is for general informational and entertainment purposes only.
          </p>
          <p className="text-[#9CA3AF] leading-relaxed">
            While we strive to keep information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information.
          </p>
        </motion.div>

        {/* Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <motion.div variants={itemVariants} className="bg-[#050816]/80 backdrop-blur-md border border-white/5 hover:border-[#EF4444]/30 rounded-xl p-6 transition-colors group">
            <h3 className="flex items-center gap-2 text-sm font-orbitron font-bold text-white uppercase tracking-widest mb-3">
              <TrendingDown className="w-4 h-4 text-[#EF4444]" /> Gaming Deals & Prices
            </h3>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
              Prices, discounts, giveaways, and offers may change or expire without notice based on regional availability and publisher decisions.
            </p>
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3 text-xs text-[#EF4444] font-bold uppercase tracking-wider">
              Always verify information on the official platform before making purchases.
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#050816]/80 backdrop-blur-md border border-white/5 hover:border-[#06B6D4]/30 rounded-xl p-6 transition-colors">
            <h3 className="flex items-center gap-2 text-sm font-orbitron font-bold text-white uppercase tracking-widest mb-3">
              <HelpCircle className="w-4 h-4 text-[#06B6D4]" /> No Professional Advice
            </h3>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              The content on this website does not constitute professional, legal, or financial advice. Any reliance you place on such information is therefore strictly at your own risk.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#050816]/80 backdrop-blur-md border border-white/5 hover:border-[#8B5CF6]/30 rounded-xl p-6 transition-colors">
            <h3 className="flex items-center gap-2 text-sm font-orbitron font-bold text-white uppercase tracking-widest mb-3">
              <ExternalLink className="w-4 h-4 text-[#8B5CF6]" /> External Websites
            </h3>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-3">
              GamesDealsHub may link to external websites and services. We have no control over the nature, content, and availability of those sites.
            </p>
            <p className="text-white text-xs border-l-2 border-[#8B5CF6] pl-3 py-1">
              The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#050816]/80 backdrop-blur-md border border-white/5 hover:border-[#22C55E]/30 rounded-xl p-6 transition-colors">
            <h3 className="flex items-center gap-2 text-sm font-orbitron font-bold text-white uppercase tracking-widest mb-3">
              <Copyright className="w-4 h-4 text-[#22C55E]" /> Fair Use
            </h3>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Some images, logos, or trademarks may belong to their respective owners and are used for informational purposes only under Fair Use doctrines. GamesDealsHub claims no ownership over third-party IP.
            </p>
          </motion.div>

        </div>

        {/* Contact Footer */}
        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 flex items-center justify-center border border-[#06B6D4]/30">
              <Mail className="w-4 h-4 text-[#06B6D4]" />
            </div>
            <div>
              <h4 className="text-white font-orbitron font-bold uppercase tracking-wider text-sm">Have Questions?</h4>
              <p className="text-[#9CA3AF] text-xs">Reach out regarding any of these policies.</p>
            </div>
          </div>
          <Link href="/contact" className="px-6 py-2.5 bg-transparent border border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white transition-colors rounded-lg font-orbitron font-bold uppercase tracking-widest text-xs">
            Contact Support
          </Link>
        </motion.div>

      </motion.div>
    </LegalLayout>
  );
}
