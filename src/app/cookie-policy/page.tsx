import { Metadata } from 'next';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | GamesDealsHub',
  description: 'GamesDealsHub cookie policy — how we use cookies to improve your experience.',
  alternates: { canonical: '/cookie-policy' }
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Shield className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-widest glow-text">Cookie Policy</h1>
        </div>

        <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#8B5CF6]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(139,92,246,0.15)] font-poppins text-[#9CA3AF] leading-relaxed space-y-8">
          <p className="text-sm font-mono text-[#8B5CF6]">Last Updated: May 2026</p>

          <p>
            <span className="text-[#06B6D4] font-orbitron font-bold tracking-wider">GamesDealsHub</span> uses cookies to improve user experience and website functionality.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">What Are Cookies?</h2>
            <p>Cookies are small files stored on your device that help websites remember information about your visit.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">How We Use Cookies</h2>
            <p>We use cookies to:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">analyze traffic</span></li>
              <li><span className="text-[#9CA3AF]">improve performance</span></li>
              <li><span className="text-[#9CA3AF]">remember preferences</span></li>
              <li><span className="text-[#9CA3AF]">support advertising</span></li>
              <li><span className="text-[#9CA3AF]">enhance website features</span></li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Third-Party Cookies</h2>
            <p>Third-party services such as Google AdSense and analytics providers may also use cookies.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Managing Cookies</h2>
            <p>You can:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">disable cookies</span></li>
              <li><span className="text-[#9CA3AF]">delete cookies</span></li>
              <li><span className="text-[#9CA3AF]">control cookie permissions</span></li>
            </ul>
            <p>through your browser settings.</p>
            <p className="font-bold text-[#8B5CF6]">Disabling cookies may affect some website functionality.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
