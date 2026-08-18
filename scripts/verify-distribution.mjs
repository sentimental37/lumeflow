import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "artifacts", "packages");
const expected = [
  "lumeflow-core-0.1.0.tgz",
  "lumeflow-angular-0.1.0.tgz",
  "lumeflow-react-0.1.0.tgz",
  "lumeflow-next-0.1.0.tgz",
  "lumeflow-cli-0.1.0.tgz",
];

assert.ok(existsSync(output), "Run npm run pack before distribution verification");
const files = new Set(readdirSync(output));
for (const archive of expected) assert.ok(files.has(archive), `Missing package archive: ${archive}`);

const manifests = [
  "packages/visual-flow/package.json",
  "packages/visual-flow-angular/package.json",
  "packages/visual-flow-react/package.json",
  "packages/visual-flow-next/package.json",
  "packages/visual-flow-cli/package.json",
];
for (const path of manifests) {
  const manifest = JSON.parse(readFileSync(resolve(root, path), "utf8"));
  assert.equal(manifest.version, "0.1.0");
  assert.equal(manifest.publishConfig?.access, "public");
  assert.equal(manifest.publishConfig?.registry, undefined);
}

console.log(`PASS ${expected.length} public package archives and neutral publication manifests verified`);
