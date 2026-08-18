import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, type Edge, type EdgeProps } from "@xyflow/react";
import type { DiagramEdge } from "@sentimental37/visual-flow";

export interface VisualFlowEdgeData extends Record<string, unknown> {
  edge: DiagramEdge;
  motion: "none" | "trace" | "flow";
}

export type VisualFlowCanvasEdge = Edge<VisualFlowEdgeData, "visualFlow">;

export function VisualFlowEdgeView(props: EdgeProps<VisualFlowCanvasEdge>) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data } = props;
  const edge = data?.edge;
  const useBezier = edge?.route === "bezier";
  const [path, labelX, labelY] = useBezier
    ? getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
    : getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: edge?.route === "orthogonal" ? 0 : 18 });
  const variant = edge?.variant ?? "default";
  const animate = edge?.animated ?? (data?.motion !== "none" && variant === "accent");
  const particles = Math.min(4, Math.max(1, edge?.particles ?? 1));
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} className={`vfr-edge vfr-edge--${variant}`} />
      {animate ? Array.from({ length: particles }, (_, index) => (
        <circle className="vfr-edge__particle" r={index === 0 ? 3.1 : 2.1} key={index}>
          <animateMotion dur={`${2.2 + index * 0.45}s`} begin={`-${index * 0.7}s`} repeatCount="indefinite" path={path} />
        </circle>
      )) : null}
      {edge?.label ? (
        <EdgeLabelRenderer>
          <span className="vfr-edge__label" style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}>{edge.label}</span>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
