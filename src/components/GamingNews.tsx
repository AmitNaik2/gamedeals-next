"use client";
import { useState, useEffect } from "react";
import { Newspaper, ChevronRight, Terminal } from "lucide-react";
import { motion } from "motion/react";

interface NewsItem {
  id: string;
  type: string;
  title: string;
  time: string;
  link: string;
}

export function GamingNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchNews = () => {
      fetch("/api/community-updates")
        .then(async res => {
          const text = await res.text();
          try { return JSON.parse(text); } catch { throw new Error("Invalid JSON from /api/community-updates"); }
        })
        .then(data => {
          if (isMounted && Array.isArray(data)) {
            setNews(data);
          }
          if (isMounted) setLoading(false);
        })
        .catch(err => {
          // ignore or silently handle fetch failure
          if (isMounted) setLoading(false);
        });
    };

    fetchNews();
    const intervalId = window.setInterval(fetchNews, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#06B6D4]/30 rounded-3xl p-5 overflow-hidden mt-6 relative group shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/10 blur-[50px] mix-blend-screen pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#06B6D4]" />
          <h3 className="text-[11px] font-orbitron font-bold uppercase tracking-[0.2em] text-[#F9FAFB] glow-text">Gaming Intel Log</h3>
        </div>
      </div>

      <div className="space-y-4 relative z-10 font-poppins">
        {loading ? (
          <div className="flex items-center gap-2 py-4">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse"></span>
            <div className="text-xs text-[#06B6D4]/70 font-mono tracking-widest uppercase">INTERCEPTING SIGNALS...</div>
          </div>
        ) : news.length > 0 ? (
          news.map((item, i) => (
            <motion.a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group/news cursor-pointer block border-b border-white/5 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/30 px-1.5 py-0.5 rounded">
                  {item.type}
                </span>
                <span className="text-[9px] text-[#9CA3AF] font-mono truncate">{item.time}</span>
              </div>
              <p className="text-sm font-semibold text-[#F9FAFB] group-hover/news:text-[#06B6D4] transition-colors line-clamp-2 pr-4 relative border-l-2 border-transparent group-hover/news:border-[#06B6D4] group-hover/news:pl-2">
                {item.title}
                <ChevronRight className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover/news:opacity-100 group-hover/news:translate-x-0 transition-all text-[#06B6D4]" />
              </p>
            </motion.a>
          ))
        ) : (
          <div className="py-2 text-xs text-[#9CA3AF] font-mono">No intercepts found right now.</div>
        )}
      </div>
    </div>
  );
}

