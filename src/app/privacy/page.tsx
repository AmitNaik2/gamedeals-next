// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/privacy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | GamesDealsHub',
  description: 'Read the GamesDealsHub privacy policy — how we collect, use, and protect your personal data.',
  alternates: { canonical: '/privacy' }
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
      <div className="prose prose-purple">
        <p>Your privacy is important to us. It is GamesDealsHub's policy to respect your privacy regarding any information we may collect from you across our website.</p>
        <h2>Information We Collect</h2>
        <p>We only ask for personal information when we truly need it to provide a service to you, such as your email address when subscribing to our newsletter. We collect it by fair and lawful means, with your knowledge and consent.</p>
        <h2>Third-Party Services</h2>
        <p>We use third-party services like Google Tag Manager and Brevo for analytics and email marketing. These services may collect information about your interaction with our site.</p>
      </div>
    </div>
  );
}
