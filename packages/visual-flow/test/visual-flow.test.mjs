import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assertVisualFlow,
  freezeVisualFlowLayout,
  layoutVisualFlow,
  renderStandaloneHtml,
  renderVisualFlow,
  resolveTheme,
  serializeVisualFlow,
  validateVisualFlow,
  VISUAL_FLOW_SCHEMA,
} from "../dist/index.js";

test("keeps the custom-element entry point safe to import during SSR", async () => {
  const elementModule = await import("../dist/element.js");
  assert.equal(typeof elementModule.VisualFlowElement, "function");
  assert.throws(() => elementModule.defineVisualFlowElement(), /browser environment/);
});

const exampleUrl = new URL("../examples/cloud-commerce.visual-flow.json", import.meta.url);

async function example() {
  return JSON.parse(await readFile(exampleUrl, "utf8"));
}

test("validates a complete diagram and reports broken references", async () => {
  const spec = await example();
  assert.equal(validateVisualFlow(spec).valid, true);
  const broken = structuredClone(spec);
  broken.edges[0].to = "missing";
  const result = validateVisualFlow(broken);
  assert.equal(result.valid, false);
  assert.match(result.issues[0].message, /Unknown target node/);
  assert.throws(() => assertVisualFlow(broken), /Invalid Visual Flow diagram/);
});

test("lays out dagre diagrams deterministically with finite dimensions", async () => {
  const spec = await example();
  const first = layoutVisualFlow(spec);
  const second = layoutVisualFlow(spec);
  assert.deepEqual(first.nodes, second.nodes);
  assert.ok(first.width >= 720);
  assert.ok(first.height >= 420);
  assert.ok(first.nodes.every((node) => Number.isFinite(node.x) && Number.isFinite(node.y)));
});

test("freezes automatic coordinates before a builder switches to manual layout", async () => {
  const frozen = freezeVisualFlowLayout(await example());
  assert.equal(frozen.layout.mode, "manual");
  assert.equal(validateVisualFlow(frozen).valid, true);
  assert.ok(frozen.nodes.every((node) => Number.isFinite(node.x) && Number.isFinite(node.y)));
});

test("renders accessible SVG with themed paths and motion particles", async () => {
  const result = renderVisualFlow(await example());
  assert.match(result.svg, /role="img"/);
  assert.match(result.svg, /aria-labelledby=/);
  assert.match(result.svg, /<animateMotion/);
  assert.match(result.svg, /data-vf-node="shopper"/);
  assert.match(result.svg, /prefers-reduced-motion/);
  assert.doesNotMatch(result.svg, /<script/i);
});

test("escapes user-controlled labels in SVG and HTML", async () => {
  const spec = await example();
  spec.title = '<script>alert("x")</script>';
  spec.nodes[0].label = "<unsafe>";
  const svg = renderVisualFlow(spec).svg;
  assert.doesNotMatch(svg, /<unsafe>/);
  assert.match(svg, /&lt;unsafe&gt;/);
  const html = renderStandaloneHtml(spec);
  assert.doesNotMatch(html, /<title><script>/);
});

test("exports stable JSON, standalone HTML, themes, and a public schema", async () => {
  const spec = await example();
  assert.equal(JSON.parse(serializeVisualFlow(spec)).id, spec.id);
  const html = renderStandaloneHtml(spec);
  assert.match(html, /Toggle theme/);
  assert.match(html, /data-export="png"/);
  assert.equal(resolveTheme("porcelain-light").name, "porcelain-light");
  assert.equal(VISUAL_FLOW_SCHEMA.properties.schemaVersion.const, 1);
});
