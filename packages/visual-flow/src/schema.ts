import type { ValidationIssue, ValidationResult, VisualFlowSpec } from "./types.js";

const kinds = new Set(["architecture", "workflow", "dataflow", "sequence", "lifecycle"]);
const layouts = new Set(["manual", "grid", "lanes", "dagre"]);

export const VISUAL_FLOW_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://visual-flow.dev/schemas/visual-flow.schema.json",
  title: "LumeFlow diagram",
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "id", "kind", "title", "nodes", "edges"],
  properties: {
    schemaVersion: { const: 1 },
    id: { type: "string", minLength: 1 },
    kind: { enum: [...kinds] },
    title: { type: "string", minLength: 1 },
    description: { type: "string" },
    layout: { type: "object" },
    theme: { oneOf: [{ type: "string" }, { type: "object" }] },
    motion: { enum: ["none", "trace", "flow"] },
    nodes: { type: "array", items: { type: "object" } },
    edges: { type: "array", items: { type: "object" } },
    groups: { type: "array", items: { type: "object" } },
    lanes: { type: "array", items: { type: "object" } },
    annotations: { type: "array", items: { type: "object" } },
    metadata: { type: "object" },
  },
} as const;

function issue(path: string, code: string, message: string, severity: "error" | "warning" = "error"): ValidationIssue {
  return { path, code, message, severity };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateVisualFlow(value: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isRecord(value)) return { valid: false, issues: [issue("$", "type", "Diagram must be a JSON object.")] };
  if (value.schemaVersion !== 1) issues.push(issue("$.schemaVersion", "schema-version", "schemaVersion must be 1."));
  if (typeof value.id !== "string" || !value.id.trim()) issues.push(issue("$.id", "required", "id must be a non-empty string."));
  if (typeof value.title !== "string" || !value.title.trim()) issues.push(issue("$.title", "required", "title must be a non-empty string."));
  if (typeof value.kind !== "string" || !kinds.has(value.kind)) issues.push(issue("$.kind", "enum", "kind must be architecture, workflow, dataflow, sequence, or lifecycle."));
  if (value.layout !== undefined && (!isRecord(value.layout) || typeof value.layout.mode !== "string" || !layouts.has(value.layout.mode))) {
    issues.push(issue("$.layout.mode", "enum", "layout.mode must be manual, grid, lanes, or dagre."));
  }
  if (!Array.isArray(value.nodes)) issues.push(issue("$.nodes", "type", "nodes must be an array."));
  if (!Array.isArray(value.edges)) issues.push(issue("$.edges", "type", "edges must be an array."));
  if (issues.some((entry) => entry.path === "$.nodes" || entry.path === "$.edges")) return { valid: false, issues };

  const nodeIds = new Set<string>();
  const nodes = value.nodes as unknown[];
  for (const [index, node] of nodes.entries()) {
    const path = `$.nodes[${index}]`;
    if (!isRecord(node)) {
      issues.push(issue(path, "type", "Node must be an object."));
      continue;
    }
    if (typeof node.id !== "string" || !node.id.trim()) issues.push(issue(`${path}.id`, "required", "Node id must be a non-empty string."));
    else if (nodeIds.has(node.id)) issues.push(issue(`${path}.id`, "duplicate", `Duplicate node id '${node.id}'.`));
    else nodeIds.add(node.id);
    if (typeof node.label !== "string" || !node.label.trim()) issues.push(issue(`${path}.label`, "required", "Node label must be a non-empty string."));
    for (const dimension of ["x", "y", "width", "height"] as const) {
      const dimensionValue = node[dimension];
      if (dimensionValue !== undefined && (typeof dimensionValue !== "number" || !Number.isFinite(dimensionValue))) {
        issues.push(issue(`${path}.${dimension}`, "finite-number", `${dimension} must be a finite number.`));
      }
    }
    if (typeof node.width === "number" && node.width < 80) issues.push(issue(`${path}.width`, "readability", "Node width below 80px may truncate content.", "warning"));
    if (typeof node.height === "number" && node.height < 48) issues.push(issue(`${path}.height`, "readability", "Node height below 48px may truncate content.", "warning"));
  }

  const edgeIds = new Set<string>();
  for (const [index, edge] of (value.edges as unknown[]).entries()) {
    const path = `$.edges[${index}]`;
    if (!isRecord(edge)) {
      issues.push(issue(path, "type", "Edge must be an object."));
      continue;
    }
    if (typeof edge.from !== "string" || !nodeIds.has(edge.from)) issues.push(issue(`${path}.from`, "unknown-node", `Unknown source node '${String(edge.from)}'.`));
    if (typeof edge.to !== "string" || !nodeIds.has(edge.to)) issues.push(issue(`${path}.to`, "unknown-node", `Unknown target node '${String(edge.to)}'.`));
    const id = typeof edge.id === "string" ? edge.id : `${String(edge.from)}--${String(edge.to)}`;
    if (edgeIds.has(id)) issues.push(issue(`${path}.id`, "duplicate", `Duplicate edge id '${id}'.`));
    edgeIds.add(id);
    if (edge.from === edge.to) issues.push(issue(path, "self-edge", "Self-referencing edges are supported but are less readable.", "warning"));
  }

  if (Array.isArray(value.groups)) {
    const groupIds = new Set<string>();
    for (const [index, group] of value.groups.entries()) {
      const path = `$.groups[${index}]`;
      if (!isRecord(group)) {
        issues.push(issue(path, "type", "Group must be an object."));
        continue;
      }
      if (typeof group.id !== "string" || !group.id.trim()) issues.push(issue(`${path}.id`, "required", "Group id is required."));
      else if (groupIds.has(group.id)) issues.push(issue(`${path}.id`, "duplicate", `Duplicate group id '${group.id}'.`));
      else groupIds.add(group.id);
      if (!Array.isArray(group.nodeIds) || group.nodeIds.length === 0) issues.push(issue(`${path}.nodeIds`, "required", "Group must wrap at least one node."));
      else for (const nodeId of group.nodeIds) if (!nodeIds.has(String(nodeId))) issues.push(issue(`${path}.nodeIds`, "unknown-node", `Group references unknown node '${String(nodeId)}'.`));
    }
  }

  if (value.layout && isRecord(value.layout) && value.layout.mode === "manual") {
    nodes.forEach((node, index) => {
      if (isRecord(node) && (typeof node.x !== "number" || typeof node.y !== "number")) {
        issues.push(issue(`$.nodes[${index}]`, "manual-position", "Manual layout nodes require numeric x and y coordinates."));
      }
    });
  }

  return { valid: !issues.some((entry) => entry.severity === "error"), issues };
}

export function assertVisualFlow(value: unknown): asserts value is VisualFlowSpec {
  const result = validateVisualFlow(value);
  if (!result.valid) {
    throw new Error(`Invalid LumeFlow diagram:\n${result.issues.filter((entry) => entry.severity === "error").map((entry) => `- ${entry.path}: ${entry.message}`).join("\n")}`);
  }
}
