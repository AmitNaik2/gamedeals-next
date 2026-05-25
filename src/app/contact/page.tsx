import { Metadata } from 'next';
import { ContactForm } from './ContactForm';
import { LegalLayout } from '@/components/LegalLayout';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | GamesDealsHub',
  description: 'Get in touch with the GamesDealsHub team. Report a missing deal or send us feedback.',
  openGraph: {
    title: 'Contact GamesDealsHub',
    description: 'Get in touch with the GamesDealsHub team. Report a missing deal or send us feedback.',
    url: 'https://www.gamesdealshub.me/contact'
  },
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return (
    <LegalLayout
      title="Contact Us"
      subtitle="System Communications Protocol"
      icon={<Mail className="w-8 h-8" />}
      accentTheme="purple"
    >
      <div className="bg-[#050816]/80 backdrop-blur-xl border-l-4 border-l-[#8B5CF6] border-t border-r border-b border-white/5 rounded-2xl p-6 lg:p-10 relative z-10 transition-all duration-300">
        <p className="text-[#9CA3AF] leading-relaxed mb-8 font-medium">
          Have a question, feedback, or want to report a missing free game? We'd love to hear from you. Enter your details below to establish a secure connection.
        </p>
        <ContactForm />
      </div>
    </LegalLayout>
  );
}
