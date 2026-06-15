import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { AuthorBox } from "@/components/AuthorBox";
import { type GamingArticle, getArticleWordCount } from "@/lib/articles";

export function ArticleLayout({ article }: { article: GamingArticle }) {
  return (
    <main className="min-h-screen px-4 py-24 md:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0F172A]/80 p-6 shadow-[0_0_30px_rgba(6,182,212,0.05)] md:p-10">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-[10px] font-orbitron font-bold uppercase tracking-widest text-[#9CA3AF]">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/guides" className="transition-colors hover:text-white">Guides</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#06B6D4]">Article</span>
        </nav>

        <AuthorBox className="mb-8" />

        <header className="mb-10">
          <p className="mb-4 text-[10px] font-orbitron font-bold uppercase tracking-widest text-[#8B5CF6]">
            Published {formatDisplayDate(article.publishedDate)} • Updated {formatDisplayDate(article.updatedDate)} • {getArticleWordCount(article)} words
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#9CA3AF]">{article.excerpt}</p>
        </header>

        <div className="space-y-10 font-poppins text-[15px] leading-8 text-[#D1D5DB]">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-4 text-2xl font-bold leading-tight text-white">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph.slice(0, 90)} className="mb-5">{paragraph}</p>
              ))}
              {section.steps && (
                <ol className="mt-4 space-y-3">
                  {section.steps.map((step, index) => (
                    <li key={step} className="flex gap-4 rounded-xl border border-white/10 bg-[#050816]/70 p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#06B6D4]/10 text-sm font-bold text-[#67E8F9]">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-white/10 bg-[#050816]/70 p-6">
          <h2 className="text-2xl font-bold text-white">FAQ</h2>
          <div className="mt-6 space-y-5">
            {article.faqs.map((faq) => (
              <div key={faq.question} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                <h3 className="font-bold text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-[#9CA3AF]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          {article.internalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#06B6D4]/50"
            >
              <h3 className="font-bold text-white">{link.label}</h3>
              <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{link.description}</p>
            </Link>
          ))}
        </section>

        {article.externalLinks.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-bold text-white">Official storefront links</h2>
            <div className="mt-4 space-y-3">
              {article.externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-[#050816]/70 p-4 transition-colors hover:border-[#8B5CF6]/50"
                >
                  <span>
                    <span className="block font-bold text-white">{link.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#9CA3AF]">{link.description}</span>
                  </span>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-[#06B6D4]" />
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}

function formatDisplayDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
