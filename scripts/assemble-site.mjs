import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const angularBrowser = resolve(root, "apps", "angular-demo", "dist", "browser");
const angularLegacy = resolve(root, "apps", "angular-demo", "dist");
const angularOutput = existsSync(angularBrowser) ? angularBrowser : angularLegacy;
const studioOutput = resolve(root, "packages", "visual-flow-studio", "dist");
const siteOutput = resolve(root, "site-dist");
const brandOutput = resolve(root, "docs", "brand");

if (!existsSync(resolve(angularOutput, "index.html"))) {
  throw new Error("Angular showcase output is missing. Build @lumeflow/angular-showcase first.");
}
if (!existsSync(resolve(studioOutput, "index.html"))) {
  throw new Error("LumeFlow Studio output is missing. Build @lumeflow/studio first.");
}

rmSync(siteOutput, { recursive: true, force: true });
mkdirSync(siteOutput, { recursive: true });
cpSync(angularOutput, siteOutput, { recursive: true });
cpSync(studioOutput, resolve(siteOutput, "builder"), { recursive: true });
cpSync(resolve(brandOutput, "lumeflow-social-preview.png"), resolve(siteOutput, "lumeflow-social-preview.png"));
cpSync(resolve(brandOutput, "lumeflow-mark.svg"), resolve(siteOutput, "lumeflow-mark.svg"));
cpSync(resolve(brandOutput, "lumeflow-builder-demo.mp4"), resolve(siteOutput, "lumeflow-builder-demo.mp4"));
cpSync(resolve(brandOutput, "lumeflow-builder-demo.gif"), resolve(siteOutput, "lumeflow-builder-demo.gif"));
cpSync(resolve(siteOutput, "index.html"), resolve(siteOutput, "404.html"));
writeFileSync(
  resolve(siteOutput, "robots.txt"),
  "User-agent: *\nAllow: /\nSitemap: https://sentimental37.github.io/lumeflow-showcase/sitemap.xml\n",
  "utf8",
);
writeFileSync(
  resolve(siteOutput, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://sentimental37.github.io/lumeflow-showcase/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://sentimental37.github.io/lumeflow-showcase/builder/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
</urlset>
`,
  "utf8",
);
writeFileSync(
  resolve(siteOutput, "site.webmanifest"),
  JSON.stringify({
    name: "LumeFlow",
    short_name: "LumeFlow",
    description: "Visual architecture diagrams that stay portable and source-controlled.",
    start_url: "./",
    display: "standalone",
    background_color: "#050b12",
    theme_color: "#07111f",
    icons: [{ src: "lumeflow-mark.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  }, null, 2),
  "utf8",
);

console.log("SITE LumeFlow showcase assembled with the builder at /builder/");
