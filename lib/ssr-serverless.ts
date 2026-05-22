import { loadSsrTemplate, resolveSsrContext } from "./ssr-handler";
import { renderHtml } from "./ssr-html";

export async function renderPage(pathName: string): Promise<string> {
  const template = loadSsrTemplate();
  if (!template) {
    throw new Error(
      "SSR template missing (dist/ssr-template.html). Run npm run build on Vercel."
    );
  }
  const ctx = await resolveSsrContext(pathName);
  return renderHtml(template, ctx);
}
