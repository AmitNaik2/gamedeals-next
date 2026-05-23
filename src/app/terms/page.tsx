// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/terms/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | GamesDealsHub',
  description: 'GamesDealsHub terms of service — the rules for using our free game deals tracker.',
  alternates: { canonical: '/terms' }
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>
      <div className="prose prose-purple">
        <p>By accessing the website at GamesDealsHub, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
        <h2>Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on GamesDealsHub's website for personal, non-commercial transitory viewing only.</p>
        <h2>Disclaimer</h2>
        <p>The materials on GamesDealsHub's website are provided on an 'as is' basis. We are an aggregator of deals and are not responsible for the fulfillment of the deals or giveaways linked on our platform.</p>
      </div>
    </div>
  );
}
