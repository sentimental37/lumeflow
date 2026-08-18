import { useCallback, useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type OnSelectionChangeParams,
  type XYPosition,
} from "@xyflow/react";
import { layoutVisualFlow, resolveTheme, type DiagramEdge, type RenderOptions, type VisualFlowSpec } from "@lumeflow/core";
import { VisualFlowEdgeView, type VisualFlowCanvasEdge } from "./VisualFlowEdge.js";
import { VisualFlowNodeView, type VisualFlowCanvasNode } from "./VisualFlowNode.js";

const nodeTypes = { visualFlow: VisualFlowNodeView };
const edgeTypes = { visualFlow: VisualFlowEdgeView };

export interface VisualFlowProps {
  spec: VisualFlowSpec;
  editable?: boolean;
  fitView?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  showBackground?: boolean;
  className?: string;
  style?: React.CSSProperties;
  theme?: RenderOptions["theme"];
  onSpecChange?: (spec: VisualFlowSpec) => void;
  onSelectionChange?: (nodeId?: string) => void;
  onCanvasDrop?: (position: XYPosition, dataTransfer: DataTransfer) => void;
}

export function toReactFlowNodes(spec: VisualFlowSpec, editable = false): VisualFlowCanvasNode[] {
  return layoutVisualFlow(spec).nodes.map((node) => ({
    id: node.id,
    type: "visualFlow",
    position: { x: node.x, y: node.y },
    data: { node, editable },
    width: node.width,
    height: node.height,
    selected: false,
  }));
}

export function toReactFlowEdges(spec: VisualFlowSpec): VisualFlowCanvasEdge[] {
  return spec.edges.map((edge, index) => ({
    id: edge.id ?? `${edge.from}-${edge.to}-${index}`,
    type: "visualFlow",
    source: edge.from,
    target: edge.to,
    data: { edge, motion: spec.motion ?? "none" },
    markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
  }));
}

function Canvas({ spec, editable = false, fitView = true, showControls = true, showMiniMap = true, showBackground = true, className, style, theme: themeInput, onSpecChange, onSelectionChange, onCanvasDrop }: VisualFlowProps) {
  const [nodes, setNodes, handleNodeChanges] = useNodesState<VisualFlowCanvasNode>(toReactFlowNodes(spec, editable));
  const [edges, setEdges, handleEdgeChanges] = useEdgesState<VisualFlowCanvasEdge>(toReactFlowEdges(spec));
  const { screenToFlowPosition } = useReactFlow();
  const theme = resolveTheme(themeInput ?? spec.theme);

  useEffect(() => setNodes(toReactFlowNodes(spec, editable)), [editable, setNodes, spec]);
  useEffect(() => setEdges(toReactFlowEdges(spec)), [setEdges, spec]);

  const variables = useMemo(() => ({
    "--vfr-background": theme.background,
    "--vfr-background-alt": theme.backgroundAlt,
    "--vfr-surface": theme.surface,
    "--vfr-surface-elevated": theme.surfaceElevated,
    "--vfr-border": theme.border,
    "--vfr-border-strong": theme.borderStrong,
    "--vfr-text": theme.text,
    "--vfr-text-muted": theme.textMuted,
    "--vfr-accent": theme.accent,
    "--vfr-accent-secondary": theme.accentSecondary,
    "--vfr-success": theme.success,
    "--vfr-warning": theme.warning,
    "--vfr-danger": theme.danger,
    "--vfr-grid": theme.grid,
    "--vfr-shadow": theme.shadow,
    "--vfr-radius": `${theme.radius}px`,
    "--vfr-font": theme.fontFamily,
    "--vfr-font-mono": theme.monoFontFamily,
    ...style,
  } as React.CSSProperties), [style, theme]);

  const emitPositions = useCallback((nextNodes: VisualFlowCanvasNode[], nextEdges = edges) => {
    if (!onSpecChange) return;
    const byId = new Map(nextNodes.map((node) => [node.id, node]));
    onSpecChange({
      ...spec,
      layout: { ...spec.layout, mode: "manual" },
      nodes: spec.nodes.filter((node) => byId.has(node.id)).map((node) => {
        const canvasNode = byId.get(node.id)!;
        return { ...node, x: canvasNode.position.x, y: canvasNode.position.y };
      }),
      edges: nextEdges.map((canvasEdge) => canvasEdge.data?.edge ?? { id: canvasEdge.id, from: canvasEdge.source, to: canvasEdge.target }),
    });
  }, [edges, onSpecChange, spec]);

  const onNodesChange = useCallback((changes: NodeChange<VisualFlowCanvasNode>[]) => handleNodeChanges(changes), [handleNodeChanges]);
  const onEdgesChange = useCallback((changes: EdgeChange<VisualFlowCanvasEdge>[]) => handleEdgeChanges(changes), [handleEdgeChanges]);
  const onNodeDragStop = useCallback(() => emitPositions(nodes), [emitPositions, nodes]);
  const onNodesDelete = useCallback((deleted: VisualFlowCanvasNode[]) => {
    const deletedIds = new Set(deleted.map((node) => node.id));
    const nextNodes = nodes.filter((node) => !deletedIds.has(node.id));
    const nextEdges = edges.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target));
    setEdges(nextEdges);
    emitPositions(nextNodes, nextEdges);
  }, [edges, emitPositions, nodes, setEdges]);
  const onEdgesDelete = useCallback((deleted: VisualFlowCanvasEdge[]) => {
    const ids = new Set(deleted.map((edge) => edge.id));
    const next = edges.filter((edge) => !ids.has(edge.id));
    setEdges(next);
    emitPositions(nodes, next);
  }, [edges, emitPositions, nodes, setEdges]);
  const onConnect = useCallback((connection: Connection) => {
    const model: DiagramEdge = { id: `edge-${crypto.randomUUID()}`, from: connection.source, to: connection.target, variant: "accent", route: "smoothstep", animated: true };
    const canvasEdge: VisualFlowCanvasEdge = { id: model.id!, type: "visualFlow", source: model.from, target: model.to, data: { edge: model, motion: spec.motion ?? "none" }, markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 } };
    const next = addEdge(canvasEdge, edges);
    setEdges(next);
    emitPositions(nodes, next);
  }, [edges, emitPositions, nodes, setEdges, spec.motion]);
  const selectionChanged = useCallback((selection: OnSelectionChangeParams<VisualFlowCanvasNode, VisualFlowCanvasEdge>) => onSelectionChange?.(selection.nodes[0]?.id), [onSelectionChange]);
  const drop = useCallback((event: React.DragEvent) => {
    if (!editable || !onCanvasDrop) return;
    event.preventDefault();
    onCanvasDrop(screenToFlowPosition({ x: event.clientX, y: event.clientY }), event.dataTransfer);
  }, [editable, onCanvasDrop, screenToFlowPosition]);

  return (
    <section className={`vfr-canvas ${className ?? ""}`} style={variables} aria-label={`${spec.title} diagram canvas`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        onSelectionChange={selectionChanged}
        onDragOver={(event) => { if (editable) event.preventDefault(); }}
        onDrop={drop}
        nodesDraggable={editable}
        nodesConnectable={editable}
        elementsSelectable={editable}
        deleteKeyCode={editable ? ["Backspace", "Delete"] : null}
        fitView={fitView}
        fitViewOptions={{ padding: 0.22, minZoom: 0.34, maxZoom: 1.4 }}
        minZoom={0.2}
        maxZoom={2.2}
        colorMode={theme.name === "porcelain-light" ? "light" : "dark"}
        proOptions={{ hideAttribution: true }}
      >
        {showBackground ? <Background color={theme.grid} gap={28} size={1} /> : null}
        {showControls ? <Controls showInteractive={editable} /> : null}
        {showMiniMap ? <MiniMap pannable zoomable maskColor={`${theme.background}a8`} nodeColor={theme.surfaceElevated} nodeStrokeColor={theme.accent} /> : null}
      </ReactFlow>
    </section>
  );
}

export function VisualFlow(props: VisualFlowProps) {
  return <ReactFlowProvider><Canvas {...props} /></ReactFlowProvider>;
}
