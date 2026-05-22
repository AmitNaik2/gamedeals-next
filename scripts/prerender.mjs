/**
 * Bakes live deal HTML into dist/ssr-template.html at build time so crawlers
 * always see indexable content even if the runtime API is slow or unavailable.
 */
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

const dist = path.join(process.cwd(), "dist");
const templatePath = path.join(dist, "ssr-template.html");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDealsListHtml(title, description, list) {
  let html = `<main id="crawler-content"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><ul>`;
  for (const item of list.slice(0, 30)) {
    const img = item.image || item.thumbnail || "";
    const store = (item.platforms || "PC").split(",")[0].trim();
    html += `<li><article>
      <h2><a href="/game/${item.id}">${escapeHtml(item.title)}</a></h2>
      ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(item.title)}" width="300" height="169" loading="lazy" />` : ""}
      <p>${escapeHtml(item.platforms || "PC")} · ${escapeHtml(item.type || "Giveaway")}</p>
      ${item.open_giveaway_url ? `<p><a href="${escapeHtml(item.open_giveaway_url)}">Claim free on ${escapeHtml(store)}</a></p>` : ""}
    </article></li>`;
  }
  html += `</ul></main>`;
  return html;
}

async function fetchDeals() {
  const url = "https://www.gamerpower.com/api/giveaways?sort-by=popularity";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GamesDealsHub/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data.slice(0, 30);
    }
  } catch (e) {
    console.warn("Prerender fetch failed:", e?.message || e);
  }
  return [];
}

try {
  if (!fs.existsSync(templatePath)) {
    console.warn("prerender: ssr-template.html not found (run postbuild first), skipping");
    process.exit(0);
  }

  const deals = await fetchDeals();
  const title = "GamesDealsHub | Track Free PC Games & Gaming Deals";
  const description =
    "Track and claim free PC games before they expire. Steam free weekends, Epic Games giveaways, and GOG freebies updated hourly.";

  const bodyHtml =
    deals.length > 0
      ? buildDealsListHtml(title, description, deals)
      : `<main id="crawler-content"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></main>`;

  const template = fs.readFileSync(templatePath, "utf-8");
  const $ = cheerio.load(template);
  $("#root").html(bodyHtml);

  $("script[data-prerender-jsonld]").remove();
  if (deals.length > 0) {
    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: deals.slice(0, 20).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.gamesdealshub.me/game/${item.id}`,
        name: item.title,
      })),
    };
    $("head").append(
      `<script type="application/ld+json" data-prerender-jsonld="true">${JSON.stringify(itemListSchema)}</script>`
    );
  }

  fs.writeFileSync(templatePath, $.html());
  console.log(`Prerender: injected ${deals.length} deals into ssr-template.html`);
} catch (err) {
  console.warn("Prerender failed (non-fatal):", err?.message || err);
  process.exit(0);
}
