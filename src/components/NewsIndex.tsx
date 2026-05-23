import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Calendar, User, Clock } from "lucide-react";

const articles = [
  {
    id: "hp-omen-16-vs-lenovo-loq",
    title: "HP Omen 16 vs Lenovo LOQ: Which Gaming Laptop is Better in 2026?",
    slug: "/article/hp-omen-16-vs-lenovo-loq",
    excerpt: "A comprehensive breakdown of performance, thermals, build quality, and value for money between the HP Omen 16 and Lenovo LOQ series.",
    author: "Amit Naik",
    date: "May 22, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80"
  },
  {
    id: "how-to-find-free-steam-games",
    title: "The Ultimate Guide to Finding Free Steam Games Before They Expire",
    slug: "/article/hp-omen-16-vs-lenovo-loq", // using the existing route for demo
    excerpt: "Stop missing out on 100% discount Steam keys. Here is our expert guide on tracking down the best freebies and giveaways.",
    author: "GamesDealsHub Team",
    date: "May 20, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80"
  },
  {
    id: "epic-games-mystery-vault-2026",
    title: "Epic Games Mega Sale 2026: What's Inside the Mystery Vault?",
    slug: "/article/hp-omen-16-vs-lenovo-loq", // using the existing route for demo
    excerpt: "The Epic Games Mega Sale is back. We analyze the leaks to predict which AAA games might be given away for free this month.",
    author: "Amit Naik",
    date: "May 18, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80"
  }
];

export function NewsIndex() {
  return (
    <div className="py-8 animate-in fade-in">
      <Helmet>
        <title>Gaming News & Guides | GamesDealsHub</title>
        <meta name="description" content="Read the latest gaming hardware reviews, free game guides, and Epic Games Store predictions from the GamesDealsHub team." />
      </Helmet>
      
      <div className="mb-12">
        <h1 className="text-3xl font-orbitron font-bold text-white mb-4">Gaming <span className="text-[#06B6D4]">News & Guides</span></h1>
        <p className="text-[#9CA3AF] max-w-2xl text-sm">Deep dives into gaming hardware, guides on how to never miss a free game deal, and the latest industry news from our editorial team.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <article key={article.id} className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden hover:border-[#06B6D4]/50 transition-colors group flex flex-col h-full">
            <Link to={article.slug} className="block relative h-48 overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-[#9CA3AF] mb-3">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-[#06B6D4] transition-colors">
                <Link to={article.slug}>{article.title}</Link>
              </h2>
              <p className="text-sm text-[#9CA3AF] mb-6 flex-1 line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <User className="w-4 h-4 text-[#06B6D4]" />
                {article.author}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
