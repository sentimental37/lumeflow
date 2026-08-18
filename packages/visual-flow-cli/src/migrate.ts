import type { DiagramEdge, DiagramKind, DiagramNode, VisualFlowSpec } from "@lumeflow/core";

function cleanLabel(value: string): string {
  return value.trim().replace(/^[[({]+|[\])}]+$/g, "").replace(/^['"]|['"]$/g, "").trim();
}

function nodeId(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "node";
}

function parseNode(token: string): { id: string; label: string } {
  const match = token.trim().match(/^([\w.-]+)(?:\s*(?:\[([^\]]+)\]|\(([^)]+)\)|\{([^}]+)\}))?$/);
  if (!match) return { id: nodeId(token), label: cleanLabel(token) };
  return { id: nodeId(match[1]), label: cleanLabel(match[2] ?? match[3] ?? match[4] ?? match[1]) };
}

function inferVariant(label: string): DiagramNode["variant"] {
  const value = label.toLowerCase();
  if (/auth|security|policy|permission|entitlement/.test(value)) return "security";
  if (/database|db|store|cache|warehouse|directory/.test(value)) return "data";
  if (/queue|event|topic|stream|kafka/.test(value)) return "event";
  if (/user|browser|ui|client|portal|hub/.test(value)) return "client";
  if (/decision|approve|deny|check/.test(value)) return "decision";
  return "service";
}

function base(title: string, kind: DiagramKind, nodes: DiagramNode[], edges: DiagramEdge[]): VisualFlowSpec {
  return {
    schemaVersion: 1,
    id: nodeId(title),
    kind,
    title,
    description: "Migrated from Mermaid. Review labels, groups, and narrative emphasis before publishing.",
    layout: { mode: "dagre", direction: kind === "sequence" ? "TB" : "LR" },
    theme: "midnight-current",
    motion: "none",
    nodes,
    edges,
  };
}

function flowchart(source: string, title: string): VisualFlowSpec {
  const nodes = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || /^(flowchart|graph|subgraph|end\b|classDef|style\b)/i.test(line)) continue;
    const match = line.match(/^(.+?)\s*(?:--\s*([^>-]+?)\s*-->|-->|==>|-.->)\s*(.+?)\s*;?$/);
    if (!match) continue;
    const left = parseNode(match[1]);
    const right = parseNode(match[3]);
    nodes.set(left.id, { id: left.id, label: left.label, variant: inferVariant(left.label) });
    nodes.set(right.id, { id: right.id, label: right.label, variant: inferVariant(right.label) });
    edges.push({ from: left.id, to: right.id, label: match[2]?.trim(), variant: edges.length === 0 ? "accent" : "default", route: "smoothstep" });
  }
  return base(title, "workflow", [...nodes.values()], edges);
}

function sequence(source: string, title: string): VisualFlowSpec {
  const nodes = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    const participant = line.match(/^(?:participant|actor)\s+([\w.-]+)(?:\s+as\s+(.+))?$/i);
    if (participant) {
      const label = cleanLabel(participant[2] ?? participant[1]);
      nodes.set(nodeId(participant[1]), { id: nodeId(participant[1]), label, variant: inferVariant(label), column: nodes.size });
      continue;
    }
    const message = line.match(/^([\w.-]+)\s*(--?>>|--?>|--?x)\s*([\w.-]+)\s*:\s*(.+)$/);
    if (!message) continue;
    const from = nodeId(message[1]);
    const to = nodeId(message[3]);
    if (!nodes.has(from)) nodes.set(from, { id: from, label: message[1], variant: inferVariant(message[1]) });
    if (!nodes.has(to)) nodes.set(to, { id: to, label: message[3], variant: inferVariant(message[3]) });
    edges.push({ from, to, label: cleanLabel(message[4]), variant: message[2].startsWith("--") ? "muted" : "accent", route: "bezier" });
  }
  const result = base(title, "sequence", [...nodes.values()], edges);
  result.layout = { mode: "grid", direction: "LR", columns: Math.max(1, nodes.size), gapX: 92 };
  return result;
}

function state(source: string, title: string): VisualFlowSpec {
  const nodes = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    const transition = line.match(/^(.+?)\s*-->\s*(.+?)(?:\s*:\s*(.+))?$/);
    if (!transition) continue;
    const fromRaw = transition[1].trim();
    const toRaw = transition[2].trim();
    if (fromRaw === "[*]" || toRaw === "[*]") continue;
    const from = parseNode(fromRaw);
    const to = parseNode(toRaw);
    nodes.set(from.id, { id: from.id, label: from.label, variant: inferVariant(from.label) });
    nodes.set(to.id, { id: to.id, label: to.label, variant: /done|complete|success/i.test(to.label) ? "event" : inferVariant(to.label) });
    edges.push({ from: from.id, to: to.id, label: transition[3]?.trim(), variant: "accent", route: "smoothstep" });
  }
  return base(title, "lifecycle", [...nodes.values()], edges);
}

export function migrateMermaid(source: string, title = "Migrated diagram"): VisualFlowSpec {
  if (/^\s*sequenceDiagram\b/im.test(source)) return sequence(source, title);
  if (/^\s*stateDiagram(?:-v2)?\b/im.test(source)) return state(source, title);
  return flowchart(source, title);
}
