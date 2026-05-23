import { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | GamesDealsHub',
  description: 'Read the GamesDealsHub privacy policy — how we collect, use, and protect your personal data.',
  alternates: { canonical: '/privacy' }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Shield className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-widest glow-text">Privacy Policy</h1>
        </div>

        <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#8B5CF6]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(139,92,246,0.15)] font-poppins text-[#9CA3AF] leading-relaxed space-y-8">
          <p className="text-sm font-mono text-[#8B5CF6]">Last Updated: May 2026</p>

          <p>
            At <span className="text-[#06B6D4] font-orbitron font-bold tracking-wider">GamesDealsHub</span>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Information We Collect</h2>
            <p>We may collect:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">basic analytics information</span></li>
              <li><span className="text-[#9CA3AF]">browser/device information</span></li>
              <li><span className="text-[#9CA3AF]">pages visited</span></li>
              <li><span className="text-[#9CA3AF]">cookies and usage data</span></li>
            </ul>
            <p className="mt-4">If you contact us directly, we may also receive:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">your email address</span></li>
              <li><span className="text-[#9CA3AF]">messages you send us</span></li>
            </ul>
            <p className="font-bold text-[#06B6D4] mt-4">We do not sell personal information.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Cookies</h2>
            <p>GamesDealsHub may use cookies to:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">improve website performance</span></li>
              <li><span className="text-[#9CA3AF]">remember preferences</span></li>
              <li><span className="text-[#9CA3AF]">analyze traffic</span></li>
              <li><span className="text-[#9CA3AF]">display relevant advertisements</span></li>
            </ul>
            <p>You can disable cookies in your browser settings.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Third-Party Services</h2>
            <p>We may use third-party services including:</p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li><span className="text-[#9CA3AF]">Google Analytics</span></li>
              <li><span className="text-[#9CA3AF]">Google AdSense</span></li>
              <li><span className="text-[#9CA3AF]">Steam/Epic Games APIs</span></li>
              <li><span className="text-[#9CA3AF]">external affiliate services</span></li>
            </ul>
            <p>These services may collect information according to their own privacy policies.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Advertising</h2>
            <p>
              Third-party vendors, including Google, may use cookies to serve ads based on your previous visits to this website or other websites.
            </p>
            <p>
              Google's advertising requirements can be found here: <br />
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#8B5CF6] hover:text-white font-bold transition-colors underline underline-offset-4">Google Advertising Policies</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Data Security</h2>
            <p>We work to protect your information, but no online platform can guarantee complete security.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Children's Privacy</h2>
            <p>GamesDealsHub does not knowingly collect personal information from children under 13.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest">Changes to This Policy</h2>
            <p>We may update this Privacy Policy at any time. Changes will be posted on this page.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
