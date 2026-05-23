// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/contact/page.tsx
import { Metadata } from 'next';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | GamesDealsHub',
  description: 'Get in touch with the GamesDealsHub team. Report a missing deal or send us feedback.',
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h1>
      <p className="mb-6 text-gray-700">Have a question, feedback, or want to report a missing free game? We'd love to hear from you.</p>
      <ContactForm />
    </div>
  );
}
