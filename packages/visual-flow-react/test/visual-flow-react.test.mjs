import { test } from "node:test";
import assert from "node:assert/strict";
import { toReactFlowEdges, toReactFlowNodes } from "../dist/index.js";

const spec = {
  schemaVersion: 1,
  id: "react-test",
  kind: "workflow",
  title: "React test",
  layout: { mode: "grid", columns: 2 },
  motion: "flow",
  nodes: [
    { id: "a", label: "Client", variant: "client" },
    { id: "b", label: "API", variant: "service" }
  ],
  edges: [{ from: "a", to: "b", label: "call", variant: "accent" }]
};

test("adapts the portable specification into editable React Flow data", () => {
  const nodes = toReactFlowNodes(spec, true);
  const edges = toReactFlowEdges(spec);
  assert.equal(nodes.length, 2);
  assert.equal(nodes[0].type, "visualFlow");
  assert.equal(nodes[0].data.editable, true);
  assert.equal(Number.isFinite(nodes[1].position.x), true);
  assert.equal(edges[0].data.edge.label, "call");
  assert.equal(edges[0].data.motion, "flow");
});
