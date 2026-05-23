import { Metadata } from 'next';
import Link from 'next/link';
import { Crosshair } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | GamesDealsHub',
  description: 'Learn about GamesDealsHub, a platform built by Amit to track free PC game deals, optimization tips, and gaming guides.',
  alternates: { canonical: '/about' }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center border border-[#06B6D4]/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Crosshair className="w-6 h-6 text-[#06B6D4]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-orbitron font-black text-white uppercase tracking-widest glow-text">About Us</h1>
        </div>

        <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#06B6D4]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.15)] font-poppins text-[#9CA3AF] leading-relaxed space-y-6">
          <p className="text-lg text-white font-medium">
            Welcome to <span className="text-[#06B6D4] font-orbitron font-bold tracking-wider">GamesDealsHub</span> — a platform built for gamers who love discovering free games, gaming deals, low-end PC optimization tips, and useful gaming content without wasting time searching across multiple websites.
          </p>

          <p>
            GamesDealsHub was created by Amit with a simple goal: <strong className="text-white">make gaming deals and useful gaming information easier to access for everyone.</strong>
          </p>

          <p>
            We understand that not every gamer owns a high-end gaming PC. Many players use budget laptops, older desktops, or entry-level setups. That's why we focus heavily on:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-white">
            <li><span className="text-[#9CA3AF]">free game giveaways</span></li>
            <li><span className="text-[#9CA3AF]">low-end PC friendly games</span></li>
            <li><span className="text-[#9CA3AF]">gaming optimization tips</span></li>
            <li><span className="text-[#9CA3AF]">game recommendations</span></li>
            <li><span className="text-[#9CA3AF]">Steam and Epic Games deals</span></li>
            <li><span className="text-[#9CA3AF]">gaming news and guides</span></li>
          </ul>

          <p>Our mission is to help gamers:</p>

          <ul className="list-disc pl-6 space-y-2 text-white">
            <li><span className="text-[#9CA3AF]">save money</span></li>
            <li><span className="text-[#9CA3AF]">discover fun games</span></li>
            <li><span className="text-[#9CA3AF]">improve performance</span></li>
            <li><span className="text-[#9CA3AF]">stay updated on limited-time offers</span></li>
          </ul>

          <p>
            We are constantly improving the platform by adding new features, guides, and tools to make GamesDealsHub more useful for the gaming community.
          </p>

          <div className="mt-8 p-6 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-2xl">
            <p>
              If you would like to contact us for questions, suggestions, or business inquiries, please visit our <Link href="/contact" className="text-[#8B5CF6] hover:text-white font-bold transition-colors underline underline-offset-4">Contact page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
