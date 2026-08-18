import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const angularBrowser = resolve(root, "apps", "angular-demo", "dist", "browser");
const angularLegacy = resolve(root, "apps", "angular-demo", "dist");
const angularOutput = existsSync(angularBrowser) ? angularBrowser : angularLegacy;
const studioOutput = resolve(root, "packages", "visual-flow-studio", "dist");
const siteOutput = resolve(root, "site-dist");

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
cpSync(resolve(siteOutput, "index.html"), resolve(siteOutput, "404.html"));
writeFileSync(resolve(siteOutput, "robots.txt"), "User-agent: *\nAllow: /\n", "utf8");

console.log("SITE LumeFlow showcase assembled with the builder at /builder/");
