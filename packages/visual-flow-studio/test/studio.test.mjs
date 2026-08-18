import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

test("production build contains the Studio shell", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /LumeFlow Studio/);
  assert.match(html, /src="\.\/assets\//);
});

test("Studio is a connected, persistent builder rather than an isolated demo", async () => {
  const source = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.match(source, /lumeflow-studio-v1/);
  assert.match(source, /legacyStorageKey/);
  assert.match(source, /onClick=\{onAdd\}/);
  assert.match(source, /href="\.\.\/"/);
  assert.match(source, /href="\.\.\/#builder"/);
  assert.match(source, /Component connections/);
  assert.match(source, /Connect \$\{selected\.label\} to/);
  assert.match(source, /Already connected to/);
});
