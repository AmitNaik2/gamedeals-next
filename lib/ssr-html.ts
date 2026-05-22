import * as cheerio from "cheerio";

const SITE = "https://www.gamesdealshub.me";
const DEFAULT_OG = `${SITE}/og-image.jpg`;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface SsrPageContext {
  pathName: string;
  title: string;
  description: string;
  preRenderedContent: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function buildStaticPageContext(pathName: string): SsrPageContext | null {
  const pages: Record<
    string,
    { title: string; description: string; heading: string; body: string }
  > = {
    "/about": {
      title: "About GamesDealsHub | How We Track Free Games",
      description:
        "Meet GamesDealsHub: we verify free Steam, Epic, and GOG giveaways hourly so you never miss a limited-time PC game drop.",
      heading: "About GamesDealsHub",
      body: "GamesDealsHub tracks free PC game deals from official stores including Steam, Epic Games Store, and GOG. We verify links, show expiry times, and send email alerts for new drops.",
    },
    "/privacy": {
      title: "Privacy Policy | GamesDealsHub",
      description:
        "GamesDealsHub privacy policy: cookies, Google AdSense, analytics, affiliate links, email alerts, and how we handle your data.",
      heading: "Privacy Policy",
      body: "This policy explains what information GamesDealsHub collects, how cookies and Google AdSense work on the site, and your choices regarding email subscriptions.",
    },
    "/terms": {
      title: "Terms of Service | GamesDealsHub",
      description:
        "GamesDealsHub terms: acceptable use, third-party store links, affiliate disclosure, disclaimers, and contact for legal questions.",
      heading: "Terms of Service",
      body: "By using GamesDealsHub you agree to our terms. Deal availability is set by third-party stores; we aggregate links for convenience and may earn affiliate commissions.",
    },
    "/contact": {
      title: "Contact GamesDealsHub | Get in Touch",
      description:
        "Email GamesDealsHub for deal tips, partnerships, advertising, or site issues. We welcome feedback from the PC gaming community.",
      heading: "Contact Us",
      body: "Reach the GamesDealsHub team for support, missing deals, or business inquiries. Join our Discord for real-time community alerts.",
    },
  };

  const page = pages[pathName];
  if (!page) return null;

  return {
    pathName,
    title: page.title,
    description: page.description,
    preRenderedContent: `<main><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p><p>${escapeHtml(page.body)}</p><nav aria-label="Site"><a href="/">Home</a> | <a href="/about">About</a> | <a href="/privacy">Privacy</a> | <a href="/terms">Terms</a> | <a href="/contact">Contact</a></nav></main>`,
    ogImage: DEFAULT_OG,
  };
}

export function buildHomeFallbackContent(pathName: string, title: string, description: string): string {
  const nav = `
    <nav aria-label="Site navigation">
      <a href="/">Home</a> |
      <a href="/free-steam-games">Free Steam Games</a> |
      <a href="/free-epic-games">Free Epic Games</a> |
      <a href="/about">About</a> |
      <a href="/contact">Contact</a>
    </nav>`;

  return `<main>${nav}<h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><p>Loading live deals…</p></main>`;
}

export function buildDealsListHtml(
  title: string,
  description: string,
  list: Array<{
    id: number | string;
    title: string;
    thumbnail?: string;
    image?: string;
    platforms?: string;
    type?: string;
    description?: string;
    open_giveaway_url?: string;
    end_date?: string;
  }>
): string {
  let html = `<main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><ul>`;
  for (const item of list.slice(0, 30)) {
    const img = item.image || item.thumbnail || "";
    const ends = item.end_date && item.end_date !== "N/A" ? ` — ends ${escapeHtml(item.end_date)}` : "";
    html += `<li>
      <article>
        <h2><a href="/game/${item.id}">${escapeHtml(item.title)}</a></h2>
        ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(item.title)}" width="300" height="169" loading="lazy" />` : ""}
        <p>${escapeHtml(item.platforms || "PC")} · ${escapeHtml(item.type || "Giveaway")}${ends}</p>
        ${item.description ? `<p>${escapeHtml(item.description.slice(0, 280))}</p>` : ""}
        ${
          item.open_giveaway_url
            ? `<p><a href="${escapeHtml(item.open_giveaway_url)}" rel="noopener noreferrer">Claim free on ${escapeHtml((item.platforms || "store").split(",")[0].trim())}</a></p>`
            : ""
        }
      </article>
    </li>`;
  }
  html += `</ul></main>`;
  return html;
}

export function buildGameDetailHtml(deal: {
  id: number | string;
  title: string;
  image?: string;
  thumbnail?: string;
  platforms?: string;
  type?: string;
  description?: string;
  instructions?: string;
  open_giveaway_url?: string;
  end_date?: string;
}): string {
  const img = deal.image || deal.thumbnail || "";
  return `<main itemscope itemtype="https://schema.org/Product">
    <h1 itemprop="name">${escapeHtml(deal.title)}</h1>
    ${img ? `<img itemprop="image" src="${escapeHtml(img)}" alt="${escapeHtml(deal.title)}" width="600" height="337" />` : ""}
    <p><strong>Platform:</strong> ${escapeHtml(deal.platforms || "PC")}</p>
    <p><strong>Type:</strong> ${escapeHtml(deal.type || "Giveaway")}</p>
    ${deal.end_date ? `<p><strong>Ends:</strong> ${escapeHtml(deal.end_date)}</p>` : ""}
    ${deal.description ? `<p itemprop="description">${escapeHtml(deal.description)}</p>` : ""}
    ${deal.instructions ? `<p>${escapeHtml(deal.instructions)}</p>` : ""}
    ${deal.open_giveaway_url ? `<p><a href="${escapeHtml(deal.open_giveaway_url)}" rel="noopener">Claim free on ${escapeHtml((deal.platforms || "store").split(",")[0].trim())}</a></p>` : ""}
    <p><a href="/">← All free games</a></p>
  </main>`;
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GamesDealsHub",
    url: `${SITE}/`,
    description: "Track and claim free PC games before they expire.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildItemListJsonLd(
  list: Array<{ id: number | string; title: string; thumbnail?: string; image?: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: list.slice(0, 20).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE}/game/${item.id}`,
      name: item.title,
      image: item.image || item.thumbnail,
    })),
  };
}

export function buildProductJsonLd(deal: {
  id: number | string;
  title: string;
  image?: string;
  thumbnail?: string;
  platforms?: string;
  description?: string;
  open_giveaway_url?: string;
  end_date?: string;
}): Record<string, unknown> {
  const store = (deal.platforms || "PC").split(",")[0].trim();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    image: deal.image || deal.thumbnail,
    description: deal.description || `Free ${deal.title} on ${store}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: deal.open_giveaway_url || `${SITE}/game/${deal.id}`,
      priceValidUntil: deal.end_date && deal.end_date !== "N/A" ? deal.end_date : undefined,
      seller: { "@type": "Organization", name: store },
    },
  };
}

export function renderHtml(template: string, ctx: SsrPageContext): string {
  const canonical = `${SITE}${ctx.pathName === "/" ? "" : ctx.pathName}`;
  const $ = cheerio.load(template);

  $("title").text(ctx.title);
  $('meta[name="title"]').attr("content", ctx.title);
  $('meta[property="og:title"]').attr("content", ctx.title);
  $('meta[property="twitter:title"]').attr("content", ctx.title);

  $('meta[name="description"]').attr("content", ctx.description);
  $('meta[property="og:description"]').attr("content", ctx.description);
  $('meta[property="twitter:description"]').attr("content", ctx.description);

  $('link[rel="canonical"]').attr("href", canonical);
  $('meta[property="og:url"]').attr("content", canonical);
  $('meta[property="twitter:url"]').attr("content", canonical);

  const ogImage = ctx.ogImage || DEFAULT_OG;
  if ($('meta[property="og:image"]').length) {
    $('meta[property="og:image"]').attr("content", ogImage);
  } else {
    $("head").append(`<meta property="og:image" content="${ogImage}" />`);
  }
  if ($('meta[property="twitter:image"]').length) {
    $('meta[property="twitter:image"]').attr("content", ogImage);
  } else {
    $("head").append(`<meta property="twitter:image" content="${ogImage}" />`);
  }

  const jsonBlocks = ctx.jsonLd
    ? Array.isArray(ctx.jsonLd)
      ? ctx.jsonLd
      : [ctx.jsonLd]
    : [buildWebsiteJsonLd()];
  $("script[data-ssr-jsonld]").remove();
  for (const block of jsonBlocks) {
    $("head").append(
      `<script type="application/ld+json" data-ssr-jsonld="true">${JSON.stringify(block)}</script>`
    );
  }

  const content =
    ctx.preRenderedContent ||
    buildHomeFallbackContent(ctx.pathName, ctx.title, ctx.description);
  $("#root").html(content);

  return $.html();
}
