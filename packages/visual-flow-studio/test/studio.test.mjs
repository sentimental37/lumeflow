import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

test("production build contains the Studio shell", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /Visual Flow Studio/);
  assert.match(html, /src="\/assets\//);
});
