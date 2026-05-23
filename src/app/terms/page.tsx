import { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | GamesDealsHub',
  description: 'GamesDealsHub terms of service — the rules for using our free game deals tracker.',
  alternates: { canonical: '/terms' }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center border border-[#06B6D4]/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Shield className="w-6 h-6 text-[#06B6D4]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-widest glow-text">Terms & Conditions</h1>
        </div>

        <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#06B6D4]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.15)] font-poppins text-[#9CA3AF] leading-relaxed space-y-8">
          <p className="text-sm font-mono text-[#06B6D4]">Last Updated: May 2026</p>

          <p className="text-lg text-white font-medium">
            Welcome to <span className="text-[#06B6D4] font-orbitron font-bold tracking-wider">GamesDealsHub</span>.
          </p>
          
          <p>By using this website, you agree to the following terms and conditions.</p>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Website Usage</h2>
            <p>You agree to use this website only for lawful purposes.</p>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">copy content without permission</span></li>
              <li><span className="text-[#9CA3AF]">attempt to damage the website</span></li>
              <li><span className="text-[#9CA3AF]">misuse tools or services</span></li>
              <li><span className="text-[#9CA3AF]">use automated systems to abuse the platform</span></li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Content Accuracy</h2>
            <p>We try to provide accurate gaming deals, prices, and information. However:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">prices may change</span></li>
              <li><span className="text-[#9CA3AF]">giveaways may expire</span></li>
              <li><span className="text-[#9CA3AF]">game information may become outdated</span></li>
            </ul>
            <p className="font-bold text-[#8B5CF6]">We do not guarantee complete accuracy at all times.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">External Links</h2>
            <p>GamesDealsHub may contain links to third-party websites such as:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">Steam</span></li>
              <li><span className="text-[#9CA3AF]">Epic Games</span></li>
              <li><span className="text-[#9CA3AF]">gaming publishers</span></li>
            </ul>
            <p>We are not responsible for third-party content or services.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Intellectual Property</h2>
            <p>
              All original content, branding, logos, and design elements on GamesDealsHub belong to the website owner unless otherwise stated.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Limitation of Liability</h2>
            <p>GamesDealsHub is provided "as is" without warranties of any kind.</p>
            <p>We are not responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">losses</span></li>
              <li><span className="text-[#9CA3AF]">damages</span></li>
              <li><span className="text-[#9CA3AF]">technical issues</span></li>
              <li><span className="text-[#9CA3AF]">third-party service interruptions</span></li>
            </ul>
            <p>resulting from the use of this website.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Changes to Terms</h2>
            <p>We may update these Terms and Conditions at any time.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
