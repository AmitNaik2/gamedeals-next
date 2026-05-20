export default async function handler(req: any, res: any) {
  try {
    const response = await fetch("https://www.gamesdealshub.me/");
    if (!response.ok) {
        throw new Error(`Failed to fetch index, status: ${response.status}`);
    }
    let html = await response.text();

    const title = "Privacy Policy | GamesDealsHub";
    const desc = "Read our privacy policy to understand how GamesDealsHub handles your data.";
    const canonical = "https://www.gamesdealshub.me/privacy";

    html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);
    
    html = html.replace(/<meta\s+(?:name|property)="(?:title|og:title|twitter:title)"\s+content="[^"]*"\s*\/?>/gi, (match) => {
      if (match.includes('og:title')) return `<meta property="og:title" content="${title}" />`;
      if (match.includes('twitter:title')) return `<meta property="twitter:title" content="${title}" />`;
      return `<meta name="title" content="${title}" />`;
    });

    html = html.replace(/<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content="[^"]*"\s*\/?>/gi, (match) => {
      if (match.includes('og:description')) return `<meta property="og:description" content="${desc}" />`;
      if (match.includes('twitter:description')) return `<meta property="twitter:description" content="${desc}" />`;
      return `<meta name="description" content="${desc}" />`;
    });

    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/gi, `<link rel="canonical" href="${canonical}" />`);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
    res.status(200).send(html);
  } catch (error) {
    console.error("SSR Error:", error);
    res.status(500).send("External server error during SSR.");
  }
}