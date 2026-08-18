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
  assert.throws(() => assertVisualFlow(broken), /Invalid LumeFlow diagram/);
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

test("routes aligned and branched connectors without folded elbows", () => {
  const base = {
    schemaVersion: 1,
    id: "connector-geometry",
    kind: "architecture",
    title: "Connector geometry",
    layout: { mode: "manual", direction: "LR" },
    nodes: [
      { id: "source", label: "Source", x: 80, y: 100, width: 196, height: 86 },
      { id: "aligned", label: "Aligned", x: 400, y: 100, width: 196, height: 86 },
      { id: "branch", label: "Branch", x: 400, y: 200, width: 196, height: 86 },
    ],
    edges: [
      { from: "source", to: "aligned" },
      { from: "source", to: "branch" },
    ],
  };

  const svg = renderVisualFlow(base, { background: false }).svg;
  assert.match(svg, /d="M 276 143 L 400 143"/);
  assert.match(svg, /d="M 276 143 L 320 143 Q 338 143 338 161 L 338 225 Q 338 243 356 243 L 400 243"/);
  assert.doesNotMatch(svg, /Q 338 143 338 161 L 338 125/);
});

test("uses vertical ports for same-column nodes and forward ranks in horizontal lanes", () => {
  const spec = {
    schemaVersion: 1,
    id: "lane-routing",
    kind: "workflow",
    title: "Lane routing",
    layout: { mode: "lanes", direction: "LR", gapX: 48 },
    lanes: [
      { id: "one", label: "One", order: 0 },
      { id: "two", label: "Two", order: 1 },
    ],
    nodes: [
      { id: "first", label: "First", lane: "one" },
      { id: "second", label: "Second", lane: "two" },
      { id: "third", label: "Third", lane: "two" },
      { id: "idle", label: "Idle", lane: "two" },
    ],
    edges: [
      { from: "first", to: "second" },
      { from: "second", to: "third" },
    ],
  };

  const positioned = layoutVisualFlow(spec);
  const byId = new Map(positioned.nodes.map((node) => [node.id, node]));
  assert.ok(byId.get("first").x < byId.get("second").x);
  assert.ok(byId.get("second").x < byId.get("third").x);
  assert.ok(byId.get("third").x < byId.get("idle").x);

  const sameColumn = structuredClone(spec);
  sameColumn.layout = { mode: "manual", direction: "LR" };
  sameColumn.nodes = [
    { id: "first", label: "First", x: 80, y: 100, width: 196, height: 86 },
    { id: "second", label: "Second", x: 80, y: 260, width: 196, height: 86 },
    { id: "third", label: "Third", x: 400, y: 260, width: 196, height: 86 },
  ];
  const svg = renderVisualFlow(sameColumn, { background: false }).svg;
  assert.match(svg, /d="M 178 186 L 178 260"/);
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
