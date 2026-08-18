import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const packageRoot = resolve(import.meta.dirname, "..");

test("ships partial-Ivy metadata and compiles in a strict Angular consumer", () => {
  const bundle = resolve(packageRoot, "dist/fesm2022/visual-flow-angular.mjs");
  const declarations = resolve(packageRoot, "dist/types/visual-flow-angular.d.ts");
  assert.equal(existsSync(bundle), true);
  assert.equal(existsSync(declarations), true);
  assert.match(readFileSync(bundle, "utf8"), /ɵɵngDeclareComponent/);

  const compilerRoot = dirname(require.resolve("@angular/compiler-cli/package.json"));
  const ngc = resolve(compilerRoot, "bundles/src/bin/ngc.js");
  execFileSync(process.execPath, [ngc, "-p", resolve(packageRoot, "test/tsconfig.json")], {
    cwd: packageRoot,
    stdio: "pipe",
  });
  assert.equal(existsSync(resolve(packageRoot, "test/.out/angular-consumer.js")), true);

});
