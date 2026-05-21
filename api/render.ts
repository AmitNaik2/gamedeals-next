// Pre-bundled in dist/ssr-render.cjs (see npm run build) for reliable Vercel cold starts.
import { renderPage } from "../dist/ssr-render.cjs";

export const config = {
  maxDuration: 30,
};

export default async function handler(
  req: { url?: string },
  res: {
    status: (code: number) => { send: (body: string) => void };
    setHeader: (name: string, value: string) => void;
  }
) {
  const rawUrl = req.url || "/";
  const pathName = rawUrl.split("?")[0] || "/";

  try {
    const html = await renderPage(pathName);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(html);
  } catch (error) {
    console.error("SSR render error:", error);
    return res.status(500).send("Error rendering page.");
  }
}
