import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("gallery exposes each flagship demo", async () => {
  const source = await readFile(new URL("../src/diagrams.ts", import.meta.url), "utf8");
  for (const title of ["Cloud Commerce Platform", "Event-Driven Order Journey", "Governed AI Agent Run"]) {
    assert.match(source, new RegExp(title));
  }
});
