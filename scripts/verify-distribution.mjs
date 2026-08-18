import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "artifacts", "packages");
const expected = [
  { archive: "lumeflow-core-0.1.0.tgz", manifest: "packages/visual-flow/package.json" },
  { archive: "lumeflow-angular-0.1.0.tgz", manifest: "packages/visual-flow-angular/package.json" },
  { archive: "lumeflow-react-0.1.0.tgz", manifest: "packages/visual-flow-react/package.json" },
  { archive: "lumeflow-next-0.1.0.tgz", manifest: "packages/visual-flow-next/package.json" },
  { archive: "lumeflow-cli-0.1.0.tgz", manifest: "packages/visual-flow-cli/package.json" },
];

assert.ok(existsSync(output), "Run npm run pack before distribution verification");
const files = new Set(readdirSync(output));
for (const packageInfo of expected) {
  assert.ok(files.has(packageInfo.archive), `Missing package archive: ${packageInfo.archive}`);
  const sourceManifest = JSON.parse(readFileSync(resolve(root, packageInfo.manifest), "utf8"));
  const archivePath = resolve(output, packageInfo.archive);
  const packedManifest = JSON.parse(execFileSync("tar", ["-xOf", archivePath, "package/package.json"], { encoding: "utf8" }));
  const packedFiles = new Set(execFileSync("tar", ["-tf", archivePath], { encoding: "utf8" }).split(/\r?\n/).filter(Boolean));

  assert.equal(packedManifest.name, sourceManifest.name);
  assert.equal(packedManifest.version, "0.1.0");
  assert.equal(packedManifest.license, "MIT");
  assert.equal(packedManifest.author, "LumeFlow contributors");
  assert.equal(packedManifest.homepage, "https://sentimental37.github.io/lumeflow-showcase/");
  assert.equal(packedManifest.bugs?.url, "https://github.com/sentimental37/lumeflow/issues");
  assert.equal(packedManifest.repository?.url, "git+https://github.com/sentimental37/lumeflow.git");
  assert.ok(packedManifest.repository?.directory, `${packedManifest.name} is missing its repository directory`);
  assert.ok(packedManifest.keywords?.length >= 5, `${packedManifest.name} needs searchable npm keywords`);
  assert.equal(packedManifest.publishConfig?.access, "public");
  assert.equal(packedManifest.publishConfig?.registry, undefined);
  assert.ok(packedFiles.has("package/README.md"), `${packedManifest.name} archive is missing README.md`);
  assert.ok(packedFiles.has("package/LICENSE"), `${packedManifest.name} archive is missing LICENSE`);
}

console.log(`PASS ${expected.length} public package archives, manifests, READMEs, and licenses verified`);
