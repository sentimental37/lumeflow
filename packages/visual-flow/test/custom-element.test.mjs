import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://visual-flow.test" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.customElements = dom.window.customElements;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.AbortController = dom.window.AbortController;

const { defineVisualFlowElement } = await import("../dist/element.js");

test("registers and renders the universal custom element from a spec property", () => {
  defineVisualFlowElement();
  const element = document.createElement("visual-flow");
  element.setAttribute("pan-zoom", "false");
  element.spec = {
    schemaVersion: 1,
    id: "web-component",
    kind: "workflow",
    title: "Web component",
    nodes: [{ id: "browser", label: "Standards-based browser" }],
    edges: [],
  };

  let ready = false;
  element.addEventListener("visual-flow-ready", () => { ready = true; });
  document.body.append(element);

  assert.equal(ready, true);
  assert.ok(element.querySelector("svg"));
  assert.match(element.exportSvg(), /Standards-based browser/);

  element.spec = { ...element.spec, title: "Updated web component" };
  assert.match(element.exportSvg(), /Updated web component/);
  element.remove();
  assert.equal(element.innerHTML, "");
});
