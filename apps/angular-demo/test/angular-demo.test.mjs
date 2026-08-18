import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL("../src/app/app.component.ts", import.meta.url);
const templatePath = new URL("../src/app/app.component.html", import.meta.url);

test("the Angular demo uses the native standalone adapter", async () => {
  const [component, template] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(templatePath, "utf8"),
  ]);

  assert.match(component, /VisualFlowAngularComponent/);
  assert.match(template, /<visual-flow-diagram/);
  assert.doesNotMatch(component, /react|next\/|@xyflow/i);
});
