#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..", "..", "..");
const cli = resolve(repositoryRoot, "packages", "visual-flow-cli", "dist", "cli.js");
const [inputArgument, outputArgument] = process.argv.slice(2);

if (!inputArgument) {
  console.error("Usage: render-visual-flow.mjs <source.visual-flow.json> [output-directory]");
  process.exit(1);
}

const input = resolve(inputArgument);
const outputDirectory = resolve(outputArgument ?? dirname(input));
const stem = basename(input, extname(input)).replace(/\.visual-flow$/, "");
mkdirSync(outputDirectory, { recursive: true });

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], { cwd: repositoryRoot, encoding: "utf8", stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(["validate", input]);
run(["render", input, "--format", "svg", "--output", resolve(outputDirectory, `${stem}.svg`)]);
run(["render", input, "--format", "html", "--output", resolve(outputDirectory, `${stem}.html`)]);
console.log(`PASS Visual Flow artifacts rendered under ${outputDirectory}`);
