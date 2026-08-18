import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { VisualFlowStatic } from "../dist/index.js";

const spec = {
  schemaVersion: 1,
  id: "next-consumer",
  kind: "architecture",
  title: "Next consumer",
  nodes: [{ id: "app", label: "Next.js application" }],
  edges: [],
};

test("renders accessible SVG from a server component without browser globals", () => {
  const html = renderToStaticMarkup(createElement(VisualFlowStatic, { spec }));
  assert.match(html, /aria-label="Next consumer diagram"/);
  assert.match(html, /<svg/);
  assert.match(html, /Next\.js application/);
});

test("preserves a dedicated client boundary in the published entry point", async () => {
  const source = await readFile(new URL("../dist/client.js", import.meta.url), "utf8");
  assert.match(source.slice(0, 200), /["']use client["']/);
  const client = await import("../dist/client.js");
  assert.equal(typeof client.VisualFlowClient, "function");
});
