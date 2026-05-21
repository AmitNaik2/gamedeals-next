import { useState, useEffect } from "react";
import { Newspaper, ChevronRight } from "lucide-react";
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
    <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-5 overflow-hidden mt-6 relative group">
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-cyan-400" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Gaming News</h3>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {loading ? (
          <div className="py-4 text-center text-xs text-white/50 animate-pulse">Crawling latest news...</div>
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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] uppercase tracking-widest font-bold text-cyan-400">
                  {item.type}
                </span>
                <span className="text-[9px] text-white/30">/</span>
                <span className="text-[9px] text-white/30 truncate">{item.time}</span>
              </div>
              <p className="text-xs font-bold text-white/80 group-hover/news:text-cyan-400 transition-colors line-clamp-2 pr-4 relative">
                {item.title}
                <ChevronRight className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover/news:opacity-100 group-hover/news:translate-x-0 transition-all text-cyan-400" />
              </p>
            </motion.a>
          ))
        ) : (
          <div className="py-2 text-xs text-white/40">No news found right now.</div>
        )}
      </div>
    </div>
  );
}
