import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const isWin = process.platform === "win32";

function localBin(name) {
  const base = path.join(root, "node_modules", ".bin", name);
  return isWin ? `${base}.cmd` : base;
}

function run(label, command) {
  console.log(`\n========== ${label} ==========\n`);
  const start = Date.now();
  execSync(command, { stdio: "inherit", env: process.env, cwd: root, shell: true });
  console.log(`\n[${label}] done in ${((Date.now() - start) / 1000).toFixed(1)}s\n`);
}

console.log("GamesDealsHub production build starting…");
console.log("Node", process.version);

if (!fs.existsSync(localBin("vite"))) {
  console.error("ERROR: node_modules missing. Run npm install first.");
  process.exit(1);
}

run("vite", `"${localBin("vite")}" build`);
run("postbuild", "node scripts/postbuild.mjs");
run("prerender", "node scripts/prerender.mjs");
run(
  "esbuild-server",
  `"${localBin("esbuild")}" server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`
);
run(
  "esbuild-ssr",
  `"${localBin("esbuild")}" lib/ssr-serverless.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/ssr-render.cjs`
);

console.log("========== BUILD SUCCESS ==========");
