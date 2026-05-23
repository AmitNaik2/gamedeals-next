import { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer | GamesDealsHub',
  description: 'GamesDealsHub disclaimer — information about our deals and third-party links.',
  alternates: { canonical: '/disclaimer' }
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center border border-[#06B6D4]/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Shield className="w-6 h-6 text-[#06B6D4]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-widest glow-text">Disclaimer</h1>
        </div>

        <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#06B6D4]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.15)] font-poppins text-[#9CA3AF] leading-relaxed space-y-8">
          <p className="text-sm font-mono text-[#06B6D4]">Last Updated: May 2026</p>

          <p>
            The information provided on <span className="text-[#06B6D4] font-orbitron font-bold tracking-wider">GamesDealsHub</span> is for general informational and entertainment purposes only.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Gaming Deals & Prices</h2>
            <p>Prices, discounts, giveaways, and offers may change or expire without notice.</p>
            <p className="font-bold text-[#8B5CF6]">Always verify information on the official platform before making purchases or claiming offers.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">No Professional Advice</h2>
            <p>The content on this website does not constitute professional, legal, or financial advice.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">External Websites</h2>
            <p>GamesDealsHub may link to external websites and services. We are not responsible for the content, policies, or reliability of third-party platforms.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Fair Use</h2>
            <p>Some images, logos, or trademarks may belong to their respective owners and are used for informational purposes only.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Contact</h2>
            <p>
              If you have questions regarding these policies, please contact us through the <Link href="/contact" className="text-[#06B6D4] hover:text-white font-bold transition-colors underline underline-offset-4">Contact page</Link> on the website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
