import dagre from "@dagrejs/dagre";
import { assertVisualFlow } from "./schema.js";
import type { DiagramDirection, DiagramLayout, PositionedDiagram, PositionedNode, VisualFlowSpec } from "./types.js";

const defaults: Required<Pick<DiagramLayout, "mode" | "direction" | "margin" | "gapX" | "gapY" | "columns" | "nodeWidth" | "nodeHeight" | "rankSeparation" | "nodeSeparation">> = {
  mode: "dagre",
  direction: "LR",
  margin: 76,
  gapX: 96,
  gapY: 68,
  columns: 4,
  nodeWidth: 196,
  nodeHeight: 86,
  rankSeparation: 116,
  nodeSeparation: 72,
};

function resolveLayout(spec: VisualFlowSpec): typeof defaults {
  return { ...defaults, ...spec.layout };
}

function dimensions(spec: VisualFlowSpec, margin: number): Pick<PositionedDiagram, "width" | "height"> {
  if (spec.nodes.length === 0) return { width: 720, height: 420 };
  const maxX = Math.max(...spec.nodes.map((node) => (node.x ?? 0) + (node.width ?? defaults.nodeWidth)));
  const maxY = Math.max(...spec.nodes.map((node) => (node.y ?? 0) + (node.height ?? defaults.nodeHeight)));
  return { width: Math.max(720, Math.ceil(maxX + margin)), height: Math.max(420, Math.ceil(maxY + margin)) };
}

function manual(spec: VisualFlowSpec, layout: typeof defaults): PositionedDiagram {
  const nodes = spec.nodes.map((node) => ({
    ...node,
    x: node.x ?? layout.margin,
    y: node.y ?? layout.margin + 80,
    width: node.width ?? layout.nodeWidth,
    height: node.height ?? layout.nodeHeight,
  }));
  const positioned = { ...spec, nodes };
  return { ...positioned, ...dimensions(positioned, layout.margin) };
}

function grid(spec: VisualFlowSpec, layout: typeof defaults): PositionedDiagram {
  const nodes = spec.nodes.map((node, index) => {
    const column = node.column ?? index % layout.columns;
    const row = node.row ?? Math.floor(index / layout.columns);
    return {
      ...node,
      x: node.x ?? layout.margin + column * (layout.nodeWidth + layout.gapX),
      y: node.y ?? layout.margin + 96 + row * (layout.nodeHeight + layout.gapY),
      width: node.width ?? layout.nodeWidth,
      height: node.height ?? layout.nodeHeight,
    };
  });
  const positioned = { ...spec, nodes };
  return { ...positioned, ...dimensions(positioned, layout.margin) };
}

function workflowRanks(spec: VisualFlowSpec): Map<string, number> {
  const nodeOrder = new Map(spec.nodes.map((node, index) => [node.id, index]));
  const indegree = new Map(spec.nodes.map((node) => [node.id, 0]));
  const outgoing = new Map(spec.nodes.map((node) => [node.id, [] as string[]]));
  for (const edge of spec.edges) {
    if (!indegree.has(edge.from) || !indegree.has(edge.to)) continue;
    outgoing.get(edge.from)?.push(edge.to);
    indegree.set(edge.to, (indegree.get(edge.to) ?? 0) + 1);
  }
  const ranks = new Map(spec.nodes.map((node) => [node.id, 0]));
  const queue = spec.nodes.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
  while (queue.length) {
    queue.sort((left, right) => (nodeOrder.get(left) ?? 0) - (nodeOrder.get(right) ?? 0));
    const current = queue.shift();
    if (!current) break;
    for (const target of outgoing.get(current) ?? []) {
      ranks.set(target, Math.max(ranks.get(target) ?? 0, (ranks.get(current) ?? 0) + 1));
      const remaining = (indegree.get(target) ?? 1) - 1;
      indegree.set(target, remaining);
      if (remaining === 0) queue.push(target);
    }
  }
  return ranks;
}

function lanes(spec: VisualFlowSpec, layout: typeof defaults): PositionedDiagram {
  const laneOrder = new Map((spec.lanes ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((lane, index) => [lane.id, index]));
  const perLane = new Map<string, number>();
  const occupiedStages = new Map<string, Set<number>>();
  const connectedNodes = new Set(spec.edges.flatMap((edge) => [edge.from, edge.to]));
  const ranks = workflowRanks(spec);
  const horizontal = layout.direction === "LR" || layout.direction === "RL";
  const nodes = spec.nodes.map((node) => {
    const lane = node.lane ?? spec.lanes?.[0]?.id ?? "main";
    const laneIndex = laneOrder.get(lane) ?? laneOrder.size;
    const positionInLane = perLane.get(lane) ?? 0;
    perLane.set(lane, positionInLane + 1);
    const explicitStage = horizontal ? node.column : node.row;
    let stage = explicitStage ?? (connectedNodes.has(node.id) ? ranks.get(node.id) ?? positionInLane : positionInLane);
    const occupied = occupiedStages.get(lane) ?? new Set<number>();
    if (explicitStage === undefined) while (occupied.has(stage)) stage += 1;
    occupied.add(stage);
    occupiedStages.set(lane, occupied);
    const primary = layout.margin + stage * (horizontal ? layout.nodeWidth + layout.gapX : layout.nodeHeight + layout.gapY);
    const secondary = layout.margin + 112 + laneIndex * (horizontal ? layout.nodeHeight + layout.gapY + 48 : layout.nodeWidth + layout.gapX);
    return {
      ...node,
      x: node.x ?? (horizontal ? primary : secondary),
      y: node.y ?? (horizontal ? secondary : primary),
      width: node.width ?? layout.nodeWidth,
      height: node.height ?? layout.nodeHeight,
      row: node.row ?? (horizontal ? laneIndex : stage),
      column: node.column ?? (horizontal ? stage : laneIndex),
    };
  });
  const positioned = { ...spec, nodes };
  return { ...positioned, ...dimensions(positioned, layout.margin) };
}

function auto(spec: VisualFlowSpec, layout: typeof defaults): PositionedDiagram {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: layout.direction,
    ranksep: layout.rankSeparation,
    nodesep: layout.nodeSeparation,
    marginx: layout.margin,
    marginy: layout.margin + 80,
  });
  for (const node of spec.nodes) graph.setNode(node.id, { width: node.width ?? layout.nodeWidth, height: node.height ?? layout.nodeHeight });
  for (const edge of spec.edges) graph.setEdge(edge.from, edge.to);
  dagre.layout(graph);
  const horizontal = layout.direction === "LR" || layout.direction === "RL";
  const nodes: PositionedNode[] = spec.nodes.map((node) => {
    const position = graph.node(node.id) as { x: number; y: number; width: number; height: number };
    return {
      ...node,
      x: node.x ?? position.x - position.width / 2,
      y: node.y ?? position.y - position.height / 2,
      width: node.width ?? position.width,
      height: node.height ?? position.height,
    };
  });
  const graphInfo = graph.graph() as { width?: number; height?: number };
  const positioned = { ...spec, nodes };
  const fitted = dimensions(positioned, layout.margin);
  return {
    ...positioned,
    width: Math.max(fitted.width, Math.ceil((graphInfo.width ?? 0) + layout.margin)),
    height: Math.max(fitted.height, Math.ceil((graphInfo.height ?? 0) + layout.margin)),
    layout: { ...spec.layout, mode: "dagre", direction: layout.direction as DiagramDirection },
  };
}

export function layoutVisualFlow(spec: VisualFlowSpec): PositionedDiagram {
  assertVisualFlow(spec);
  const layout = resolveLayout(spec);
  if (layout.mode === "manual") return manual(spec, layout);
  if (layout.mode === "grid") return grid(spec, layout);
  if (layout.mode === "lanes") return lanes(spec, layout);
  return auto(spec, layout);
}

export function freezeVisualFlowLayout(spec: VisualFlowSpec): VisualFlowSpec {
  const positioned = layoutVisualFlow(spec);
  return {
    ...spec,
    layout: { ...spec.layout, mode: "manual" },
    nodes: positioned.nodes,
  };
}
