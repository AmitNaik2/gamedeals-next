import fs from "fs";
import path from "path";

const dist = path.join(process.cwd(), "dist");
const indexPath = path.join(dist, "index.html");
const templatePath = path.join(dist, "ssr-template.html");

// Prevent Vercel from serving a static index.html at `/` (which bypasses SSR).
if (fs.existsSync(indexPath)) {
  fs.renameSync(indexPath, templatePath);
  console.log("[postbuild] Renamed dist/index.html -> dist/ssr-template.html");
}
// Vercel serves dist/index.html at `/` before rewrites — it must not exist.
if (fs.existsSync(indexPath)) {
  fs.unlinkSync(indexPath);
  console.log("[postbuild] Removed stray dist/index.html");
}
if (fs.existsSync(templatePath)) {
  console.log("[postbuild] ssr-template.html already present");
} else {
  console.error("[postbuild] ERROR: no dist/index.html or ssr-template.html after vite build");
  process.exit(1);
}

// Ensure crawlers can read robots.txt from the static output directory.
const publicRobots = path.join(process.cwd(), "public", "robots.txt");
const distRobots = path.join(dist, "robots.txt");
if (fs.existsSync(publicRobots)) {
  fs.copyFileSync(publicRobots, distRobots);
}

// Static sitemap fallback (dynamic sitemap still served from /api/index)
const publicSitemap = path.join(process.cwd(), "public", "sitemap.xml");
const distSitemap = path.join(dist, "sitemap.xml");
if (fs.existsSync(publicSitemap)) {
  fs.copyFileSync(publicSitemap, distSitemap);
}
