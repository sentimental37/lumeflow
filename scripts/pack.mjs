import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "artifacts", "packages");
const packages = [
  { name: "@sentimental37/visual-flow", source: "./packages/visual-flow" },
  { name: "@sentimental37/visual-flow-angular", source: "./packages/visual-flow-angular/dist" },
  { name: "@sentimental37/visual-flow-react", source: "./packages/visual-flow-react" },
  { name: "@sentimental37/visual-flow-next", source: "./packages/visual-flow-next" },
  { name: "@sentimental37/visual-flow-cli", source: "./packages/visual-flow-cli" },
];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const packageInfo of packages) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error("npm_execpath is unavailable; run this script through npm run pack");
  const result = spawnSync(process.execPath, [npmCli, "pack", packageInfo.source, `--pack-destination=${output}`, "--json"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr ?? result.stdout ?? result.error?.message ?? "npm pack failed");
    process.exit(result.status ?? 1);
  }
  const report = JSON.parse(result.stdout);
  const packed = report[0];
  console.log(`PACK ${packageInfo.name} -> ${packed.filename} (${packed.size} bytes, ${packed.entryCount} files)`);
}
