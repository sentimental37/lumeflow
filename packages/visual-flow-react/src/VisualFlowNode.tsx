import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { DiagramNode } from "@lumeflow/core";

export interface VisualFlowNodeData extends Record<string, unknown> {
  node: DiagramNode;
  editable: boolean;
}

export type VisualFlowCanvasNode = Node<VisualFlowNodeData, "visualFlow">;

function initials(node: DiagramNode): string {
  return (node.icon ?? node.label.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)).toUpperCase();
}

export function VisualFlowNodeView({ data, selected }: NodeProps<VisualFlowCanvasNode>) {
  const { node, editable } = data;
  const variant = node.variant ?? "default";
  return (
    <article className={`vfr-node vfr-node--${variant}${selected ? " is-selected" : ""}`} aria-label={node.description ? `${node.label}: ${node.description}` : node.label}>
      <Handle className="vfr-handle" type="target" position={Position.Left} isConnectable={editable} />
      <span className="vfr-node__rail" />
      <span className="vfr-node__icon" aria-hidden="true">{initials(node)}</span>
      <span className="vfr-node__copy">
        <strong>{node.label}</strong>
        {node.description ? <small>{node.description}</small> : null}
      </span>
      {node.badges?.length ? <span className="vfr-node__badges">{node.badges.slice(0, 2).map((badge) => <em key={badge}>{badge}</em>)}</span> : null}
      <Handle className="vfr-handle" type="source" position={Position.Right} isConnectable={editable} />
    </article>
  );
}
