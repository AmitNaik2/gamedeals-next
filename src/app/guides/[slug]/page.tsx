import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { JsonLd } from "@/components/JsonLd";
import { gamingArticles, getArticleBySlug, siteUrl } from "@/lib/articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return gamingArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Guide Not Found | GamesDealsHub",
    };
  }

  const url = `${siteUrl}/guides/${article.slug}`;
  const ogImage = `/og?${new URLSearchParams({
    title: article.ogTitle,
    platform: "Guide",
    expiry: "Updated 2026",
  }).toString()}`;

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    authors: [{ name: article.author, url: `${siteUrl}/about` }],
    alternates: { canonical: url },
    openGraph: {
      title: article.ogTitle,
      description: article.ogDescription,
      url,
      siteName: "GamesDealsHub",
      type: "article",
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate,
      authors: [article.author],
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.ogTitle,
      description: article.ogDescription,
      images: [ogImage],
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const articleUrl = `${siteUrl}/guides/${article.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    mainEntityOfPage: articleUrl,
    keywords: article.keywords,
    author: {
      "@type": "Person",
      name: article.author,
      url: `${siteUrl}/about`,
      description: article.authorDescription,
    },
    publisher: {
      "@type": "Organization",
      name: "GamesDealsHub",
      url: siteUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${siteUrl}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
      <ArticleLayout article={article} />
    </>
  );
}
