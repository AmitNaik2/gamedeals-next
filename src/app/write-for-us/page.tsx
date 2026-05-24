import React from 'react';
import Link from 'next/link';
import { Mail, Gamepad2, TrendingUp, Users } from 'lucide-react';

export default function WriteForUsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-gray-300">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-[#06B6D4] mb-4 uppercase tracking-widest">
          Write For Us
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Join the GamesDealsHub team and share your passion for gaming with thousands of daily readers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-[#111827] p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">What We're Looking For</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-[#06B6D4] mr-3 mt-1">✓</span>
              <span><strong>Game Reviews:</strong> In-depth, honest reviews of new releases and hidden gems.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#06B6D4] mr-3 mt-1">✓</span>
              <span><strong>Deal Guides:</strong> Tips on how to get the best gaming hardware and software deals.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#06B6D4] mr-3 mt-1">✓</span>
              <span><strong>Editorials:</strong> Opinion pieces on the gaming industry, trends, and news.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#06B6D4] mr-3 mt-1">✓</span>
              <span><strong>Listicles:</strong> Top 10s, best games of the year, best free-to-play titles.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-8">
          <div className="flex items-start">
            <div className="bg-[#06B6D4]/10 p-3 rounded-lg mr-4 text-[#06B6D4]">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Reach a Gamer Audience</h3>
              <p className="text-gray-400">Get your work seen by thousands of passionate gamers looking for their next favorite game.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-[#06B6D4]/10 p-3 rounded-lg mr-4 text-[#06B6D4]">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Build Your Portfolio</h3>
              <p className="text-gray-400">Perfect for aspiring games journalists wanting to build a strong portfolio of published work.</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-[#06B6D4]/10 p-3 rounded-lg mr-4 text-[#06B6D4]">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Grow With Us</h3>
              <p className="text-gray-400">We promote our writers on social media and provide author bylines with links to your profiles.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#06B6D4]/20 to-purple-500/20 p-8 md:p-12 rounded-3xl border border-gray-800 text-center">
        <h2 className="text-3xl font-bold text-white mb-4 font-orbitron">How to Pitch Us</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Send us an email with the subject line <strong>"Pitch: [Your Article Idea]"</strong>. 
          Include a brief outline of your idea, why it's a good fit for GamesDealsHub, and links to 1-2 previous writing samples if you have them.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#06B6D4] hover:bg-[#0891b2] text-black font-bold rounded-lg transition-colors"
          >
            <Mail className="mr-2" size={20} />
            Pitch via Contact Form
          </Link>
          <a 
            href="mailto:gamedealshub1@gmail.com"
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg border border-gray-700 transition-colors"
          >
            Email Us Directly
          </a>
        </div>
      </div>
    </div>
  );
}
