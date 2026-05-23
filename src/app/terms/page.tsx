"use client";

import { motion } from 'motion/react';
import { FileText, ShieldAlert, Cpu, Share2, Scale, RefreshCcw, ChevronRight } from 'lucide-react';
import { LegalLayout } from '@/components/LegalLayout';
import { useState, useEffect } from 'react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('usage');

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

  const sections = [
    { id: 'usage', icon: <Cpu className="w-4 h-4" />, title: 'Website Usage' },
    { id: 'accuracy', icon: <ShieldAlert className="w-4 h-4" />, title: 'Content Accuracy' },
    { id: 'external', icon: <Share2 className="w-4 h-4" />, title: 'External Links' },
    { id: 'ip', icon: <FileText className="w-4 h-4" />, title: 'Intellectual Property' },
    { id: 'liability', icon: <Scale className="w-4 h-4" />, title: 'Limitation of Liability' },
    { id: 'changes', icon: <RefreshCcw className="w-4 h-4" />, title: 'Changes to Terms' }
  ];

  // Intersection observer logic to highlight active section in sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <LegalLayout 
      title="Terms & Conditions" 
      subtitle="Operational Directives & Protocols" 
      icon={<FileText className="w-8 h-8" />}
      accentTheme="cyan"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* Sticky Sidebar Navigation (Desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col w-64 shrink-0 sticky top-32 space-y-2 bg-[#0F172A]/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl"
        >
          <div className="text-xs font-orbitron font-bold text-[#9CA3AF] uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Index</div>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-xs font-orbitron tracking-widest uppercase transition-all duration-300 ${
                activeSection === sec.id 
                  ? 'bg-[#06B6D4]/20 text-[#06B6D4] border-l-2 border-[#06B6D4]' 
                  : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white border-l-2 border-transparent'
              }`}
            >
              {sec.icon} <span className="truncate">{sec.title}</span>
            </button>
          ))}
        </motion.div>

        {/* Main Content Area */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 space-y-8 min-w-0 w-full"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-md text-[#06B6D4] text-xs font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              Last Updated: May 2026
            </span>
          </motion.div>
          <motion.p variants={itemVariants} className="text-lg text-white font-medium mb-8">
            Welcome to <span className="text-[#06B6D4] font-orbitron font-bold tracking-wider">GamesDealsHub</span>. By using this website, you agree to the following operational protocols and conditions.
          </motion.p>

          <div className="space-y-8">
            {/* Section 1 */}
            <motion.section variants={itemVariants} id="usage" className="scroll-mt-32">
              <div className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#06B6D4] to-transparent"></div>
                <h2 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#06B6D4]" /> Website Usage
                </h2>
                <p className="text-[#9CA3AF] mb-4">You agree to use this website only for lawful purposes. You may not:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['copy content without permission', 'attempt to damage the website', 'misuse tools or services', 'use automated systems to abuse the platform'].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-start gap-3">
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#EC4899] shadow-[0_0_5px_#EC4899]"></div>
                      <span className="text-sm text-[#E2E8F0]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section variants={itemVariants} id="accuracy" className="scroll-mt-32">
              <div className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8B5CF6] to-transparent"></div>
                <h2 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#8B5CF6]" /> Content Accuracy
                </h2>
                <p className="text-[#9CA3AF] mb-4">We try to provide accurate gaming deals, prices, and information. However:</p>
                <ul className="space-y-2 mb-4 pl-4 border-l-2 border-white/10 ml-2">
                  {['prices may change', 'giveaways may expire', 'game information may become outdated'].map((item, i) => (
                    <li key={i} className="text-sm text-[#E2E8F0] list-disc list-inside">{item}</li>
                  ))}
                </ul>
                <p className="text-[#F59E0B] font-bold font-orbitron tracking-widest text-xs uppercase bg-[#F59E0B]/10 inline-block px-3 py-1.5 rounded border border-[#F59E0B]/30">We do not guarantee complete accuracy at all times.</p>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section variants={itemVariants} id="external" className="scroll-mt-32">
              <div className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#06B6D4] to-transparent"></div>
                <h2 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#06B6D4]" /> External Links
                </h2>
                <p className="text-[#9CA3AF] mb-4">GamesDealsHub may contain links to third-party websites such as:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Steam', 'Epic Games', 'Gaming Publishers'].map((item, i) => (
                    <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-xs text-white uppercase tracking-widest">{item}</span>
                  ))}
                </div>
                <p className="text-[#9CA3AF] text-sm">We are not responsible for third-party content or services.</p>
              </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section variants={itemVariants} id="ip" className="scroll-mt-32">
              <div className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#EC4899] to-transparent"></div>
                <h2 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#EC4899]" /> Intellectual Property
                </h2>
                <p className="text-[#E2E8F0] leading-relaxed">
                  All original content, branding, logos, and design elements on GamesDealsHub belong to the website owner unless otherwise stated.
                </p>
              </div>
            </motion.section>

            {/* Section 5 */}
            <motion.section variants={itemVariants} id="liability" className="scroll-mt-32">
              <div className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#22C55E] to-transparent"></div>
                <h2 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#22C55E]" /> Limitation of Liability
                </h2>
                <p className="text-white font-medium mb-4">GamesDealsHub is provided "as is" without warranties of any kind.</p>
                <p className="text-[#9CA3AF] mb-4">We are not responsible for:</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {['losses', 'damages', 'technical issues', 'third-party service interruptions'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded border border-white/5 text-sm text-[#E2E8F0]">
                      <ChevronRight className="w-4 h-4 text-[#22C55E]" /> {item}
                    </div>
                  ))}
                </div>
                <p className="text-[#9CA3AF] text-sm italic">...resulting from the use of this website.</p>
              </div>
            </motion.section>

            {/* Section 6 */}
            <motion.section variants={itemVariants} id="changes" className="scroll-mt-32">
              <div className="bg-[#050816]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#06B6D4] to-transparent"></div>
                <h2 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5 text-[#06B6D4]" /> Changes to Terms
                </h2>
                <p className="text-[#E2E8F0]">We may update these Terms and Conditions at any time.</p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </LegalLayout>
  );
}
