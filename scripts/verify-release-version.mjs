import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const expectedVersion = process.argv[2];
assert.match(expectedVersion ?? "", /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, "Pass an exact release version such as 0.1.0");

const manifests = [
  "package.json",
  "packages/visual-flow/package.json",
  "packages/visual-flow-angular/package.json",
  "packages/visual-flow-react/package.json",
  "packages/visual-flow-next/package.json",
  "packages/visual-flow-cli/package.json",
];

for (const path of manifests) {
  const manifest = JSON.parse(readFileSync(resolve(root, path), "utf8"));
  assert.equal(manifest.version, expectedVersion, `${path} does not match ${expectedVersion}`);
}

const tag = `v${expectedVersion}`;
const tagsAtHead = execFileSync("git", ["tag", "--points-at", "HEAD"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);
assert.ok(tagsAtHead.includes(tag), `HEAD is not tagged ${tag}`);

const changelog = readFileSync(resolve(root, "CHANGELOG.md"), "utf8");
assert.ok(changelog.includes(`## [${expectedVersion}]`), `CHANGELOG.md has no ${expectedVersion} entry`);

console.log(`PASS release manifests and HEAD tag agree on ${expectedVersion}`);
