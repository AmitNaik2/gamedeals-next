// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/contact/page.tsx
import { Metadata } from 'next';

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
      <form className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea id="message" rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"></textarea>
        </div>
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg self-start transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
}
