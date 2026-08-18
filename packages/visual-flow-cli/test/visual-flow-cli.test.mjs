import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import assert from "node:assert/strict";
import { migrateMermaid } from "../dist/index.js";

test("migrates flowchart, sequence, and lifecycle Mermaid topology", () => {
  const flow = migrateMermaid("flowchart LR\n A[Browser] --> B[API]", "Request path");
  assert.equal(flow.nodes.length, 2);
  assert.equal(flow.edges[0].from, "a");
  const sequence = migrateMermaid("sequenceDiagram\n participant UI\n UI->>API: GET /apps", "Calls");
  assert.equal(sequence.kind, "sequence");
  assert.equal(sequence.edges[0].label, "GET /apps");
  const lifecycle = migrateMermaid("stateDiagram-v2\n Draft --> Approved: review", "Lifecycle");
  assert.equal(lifecycle.kind, "lifecycle");
});

test("validates and renders a diagram through the executable", async () => {
  const directory = await mkdtemp(join(tmpdir(), "visual-flow-cli-"));
  const input = join(directory, "sample.visual-flow.json");
  const output = join(directory, "sample.svg");
  await writeFile(input, JSON.stringify(migrateMermaid("flowchart LR\n A[UI] --> B[API]", "Sample")), "utf8");
  const cli = fileURLToPath(new URL("../dist/cli.js", import.meta.url));
  const validation = spawnSync(process.execPath, [cli, "validate", input], { encoding: "utf8" });
  assert.equal(validation.status, 0, validation.stderr);
  assert.match(validation.stdout, /PASS/);
  const render = spawnSync(process.execPath, [cli, "render", input, "--format", "svg", "--output", output], { encoding: "utf8" });
  assert.equal(render.status, 0, render.stderr);
  assert.match(await readFile(output, "utf8"), /<svg/);
});
