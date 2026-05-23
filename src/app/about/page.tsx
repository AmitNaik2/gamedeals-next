// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | GamesDealsHub',
  description: 'Learn how GamesDealsHub tracks free PC game deals from Epic Games, Steam, and GOG — updated every day.',
  alternates: { canonical: '/about' }
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">About GamesDealsHub</h1>
      <div className="prose prose-purple">
        <p>GamesDealsHub is your ultimate destination for tracking and claiming free PC games. Our mission is to ensure you never miss a giveaway from major platforms like Epic Games, Steam, GOG, and Prime Gaming.</p>
        <p>We automatically aggregate deals so you don't have to scour the internet. Everything is updated in near real-time, complete with countdown timers so you know exactly how long you have to claim your free games.</p>
      </div>
    </div>
  );
}
