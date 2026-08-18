import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL("../src/app/app.component.ts", import.meta.url);
const templatePath = new URL("../src/app/app.component.html", import.meta.url);
const diagramsPath = new URL("../src/app/diagrams.ts", import.meta.url);
const apiReferencePath = new URL("../src/app/api-reference.ts", import.meta.url);

test("the Angular demo uses the native standalone adapter", async () => {
  const [component, template] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(templatePath, "utf8"),
  ]);

  assert.match(component, /VisualFlowAngularComponent/);
  assert.match(template, /<visual-flow-diagram/);
  assert.doesNotMatch(component, /react|next\/|@xyflow/i);
});

test("the Angular showcase documents and demonstrates the complete public surface", async () => {
  const [component, template, diagrams, apiReference] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(templatePath, "utf8"),
    readFile(diagramsPath, "utf8"),
    readFile(apiReferencePath, "utf8"),
  ]);

  assert.match(template, /Theme laboratory/);
  assert.match(template, /Complete public API/);
  assert.match(template, /Portable contract reference/);
  assert.match(template, /Interactive capability atlas/);
  assert.match(component, /downloadVisualFlow/);
  assert.match(component, /validateVisualFlow/);
  assert.match(component, /colorTokens/);
  assert.match(diagrams, /visual-flow-capability-atlas/);
  assert.match(diagrams, /Connector Route Gallery/);
  assert.match(diagrams, /Semantic Visual Language/);
  assert.match(apiReference, /renderVisualFlow/);
  assert.match(apiReference, /VisualFlowAngularComponent/);
  assert.match(apiReference, /VisualFlowStatic/);
  assert.match(apiReference, /migrate-mermaid/);
});

test("the showcase exposes every theme color token and export format", async () => {
  const component = await readFile(componentPath, "utf8");
  for (const token of [
    "background", "backgroundAlt", "surface", "surfaceElevated", "border", "borderStrong",
    "text", "textMuted", "accent", "accentSecondary", "success", "warning", "danger", "grid",
  ]) assert.match(component, new RegExp(`key: "${token}"`));

  for (const format of ["json", "svg", "html", "png", "jpeg", "webp"]) {
    assert.match(component, new RegExp(`id: "${format}"`));
  }
});
