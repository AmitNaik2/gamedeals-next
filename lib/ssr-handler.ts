import fs from "fs";
import path from "path";
import {
  buildDealsListHtml,
  buildGameDetailHtml,
  buildHomeFallbackContent,
  buildItemListJsonLd,
  buildProductJsonLd,
  buildStaticPageContext,
  buildWebsiteJsonLd,
  type SsrPageContext,
} from "./ssr-html";
import { fetchGamerPower, isActiveGiveaway } from "./gamerpower";

export function loadSsrTemplate(): string {
  const candidates = [
    path.join(process.cwd(), "dist", "ssr-template.html"),
    path.join(process.cwd(), "dist", "index.html"),
    path.join(process.cwd(), "index.html"),
  ];
  for (const filePath of candidates) {
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch {
      /* try next */
    }
  }
  return "";
}

export async function resolveSsrContext(pathName: string): Promise<SsrPageContext> {
  const normalized = pathName === "" ? "/" : pathName.split("?")[0];

  const staticPage = buildStaticPageContext(normalized);
  if (staticPage) {
    return {
      ...staticPage,
      jsonLd: [buildWebsiteJsonLd(), ...(staticPage.jsonLd ? [staticPage.jsonLd] : [])],
    };
  }

  if (normalized.startsWith("/game/")) {
    const id = normalized.split("/")[2];
    const defaultTitle = "Free Game Deal | GamesDealsHub";
    const defaultDesc =
      "Claim this free PC game before the giveaway ends. Official store link verified by GamesDealsHub.";
    try {
      const dl = (await fetchGamerPower(
        `https://www.gamerpower.com/api/giveaway?id=${id}`
      )) as Record<string, string>;
      if (dl?.title) {
        const plainDesc = (dl.description || defaultDesc).replace(/<[^>]*>/g, "").slice(0, 160);
        return {
          pathName: normalized,
          title: `${dl.title} - Free ${dl.platforms || "PC"} Game | GamesDealsHub`,
          description: plainDesc,
          preRenderedContent: buildGameDetailHtml(dl),
          ogImage: dl.image || dl.thumbnail,
          jsonLd: [buildWebsiteJsonLd(), buildProductJsonLd(dl)],
        };
      }
    } catch (e) {
      console.warn("SSR game fetch failed", e);
    }
    return {
      pathName: normalized,
      title: defaultTitle,
      description: defaultDesc,
      preRenderedContent: buildHomeFallbackContent(normalized, defaultTitle, defaultDesc),
      jsonLd: [buildWebsiteJsonLd()],
    };
  }

  let title = "GamesDealsHub | Track Free PC Games & Gaming Deals";
  let description =
    "Track and claim free PC games before they expire. Steam free weekends, Epic Games giveaways, and GOG freebies updated hourly.";
  let apiUrl = "https://www.gamerpower.com/api/giveaways?sort-by=popularity";

  if (normalized === "/free-steam-games") {
    title = "Free Steam Games & Weekends | GamesDealsHub";
    description =
      "Active free Steam games, free weekends, and DLC giveaways. Claim directly on Steam before offers expire.";
    apiUrl = "https://www.gamerpower.com/api/giveaways?platform=steam";
  } else if (normalized === "/free-epic-games") {
    title = "Free Epic Games Weekly | GamesDealsHub";
    description =
      "Every free Epic Games Store title this week. Add to your library before the Thursday reset.";
    apiUrl = "https://www.gamerpower.com/api/giveaways?platform=epic-games-store";
  } else if (normalized === "/free-gog-games") {
    title = "Free GOG Games & DRM-Free Giveaways | GamesDealsHub";
    description =
      "Free GOG games and DRM-free promotions. Keep every title forever in your GOG library.";
    apiUrl = "https://www.gamerpower.com/api/giveaways?platform=gog";
  } else if (normalized === "/expired") {
    title = "Expired Free Games Archive | GamesDealsHub";
    description =
      "Recently expired free game giveaways on Steam, Epic, and GOG. See what ended and catch the next drop.";
    try {
      const all = (await fetchGamerPower(
        "https://www.gamerpower.com/api/giveaways?sort-by=date"
      )) as Array<{ end_date?: string; status?: string }>;
      const expired = Array.isArray(all)
        ? all.filter((d) => !isActiveGiveaway(d)).slice(0, 30)
        : [];
      return {
        pathName: normalized,
        title,
        description,
        preRenderedContent:
          expired.length > 0
            ? buildDealsListHtml(title, description, expired)
            : buildHomeFallbackContent(normalized, title, description),
        jsonLd: [
          buildWebsiteJsonLd(),
          ...(expired.length > 0 ? [buildItemListJsonLd(expired)] : []),
        ],
      };
    } catch (e) {
      console.warn("SSR expired fetch failed", e);
    }
    return {
      pathName: normalized,
      title,
      description,
      preRenderedContent: buildHomeFallbackContent(normalized, title, description),
      jsonLd: [buildWebsiteJsonLd()],
    };
  }

  try {
    const list = (await fetchGamerPower(apiUrl)) as Array<{
      end_date?: string;
      status?: string;
    }>;
    if (Array.isArray(list) && list.length > 0) {
      const active = list.filter(isActiveGiveaway).slice(0, 30);
      const deals = active.length > 0 ? active : list.slice(0, 30);
      return {
        pathName: normalized,
        title,
        description,
        preRenderedContent: buildDealsListHtml(title, description, deals),
        jsonLd: [buildWebsiteJsonLd(), buildItemListJsonLd(deals)],
      };
    }
  } catch (e) {
    console.warn("SSR list fetch failed", e);
  }

  return {
    pathName: normalized,
    title,
    description,
    preRenderedContent: buildHomeFallbackContent(normalized, title, description),
    jsonLd: buildWebsiteJsonLd(),
  };
}
