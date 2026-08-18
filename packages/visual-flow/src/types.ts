export type DiagramKind = "architecture" | "workflow" | "dataflow" | "sequence" | "lifecycle";
export type DiagramDirection = "LR" | "RL" | "TB" | "BT";
export type DiagramLayoutMode = "manual" | "grid" | "lanes" | "dagre";
export type EdgeRoute = "straight" | "bezier" | "orthogonal" | "smoothstep";
export type EdgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "muted";
export type NodeVariant = "default" | "service" | "client" | "data" | "security" | "event" | "decision" | "external";
export type MotionMode = "none" | "trace" | "flow";

export interface VisualFlowMetadata {
  title?: string;
  description?: string;
  owner?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface DiagramLayout {
  mode: DiagramLayoutMode;
  direction?: DiagramDirection;
  margin?: number;
  gapX?: number;
  gapY?: number;
  columns?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  rankSeparation?: number;
  nodeSeparation?: number;
}

export interface DiagramNode {
  id: string;
  label: string;
  description?: string;
  variant?: NodeVariant;
  icon?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  row?: number;
  column?: number;
  lane?: string;
  group?: string;
  badges?: string[];
  metadata?: Record<string, unknown>;
}

export interface DiagramEdge {
  id?: string;
  from: string;
  to: string;
  label?: string;
  variant?: EdgeVariant;
  route?: EdgeRoute;
  animated?: boolean;
  particles?: number;
  metadata?: Record<string, unknown>;
}

export interface DiagramGroup {
  id: string;
  label: string;
  nodeIds: string[];
  variant?: "default" | "security" | "region" | "emphasis";
  description?: string;
}

export interface DiagramLane {
  id: string;
  label: string;
  description?: string;
  order?: number;
}

export interface DiagramAnnotation {
  id: string;
  text: string;
  x: number;
  y: number;
  variant?: "note" | "info" | "warning";
}

export interface VisualFlowSpec {
  schemaVersion: 1;
  id: string;
  kind: DiagramKind;
  title: string;
  description?: string;
  layout?: DiagramLayout;
  theme?: string | Partial<VisualFlowTheme>;
  motion?: MotionMode;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  lanes?: DiagramLane[];
  annotations?: DiagramAnnotation[];
  metadata?: VisualFlowMetadata;
}

export interface VisualFlowTheme {
  name: string;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  success: string;
  warning: string;
  danger: string;
  grid: string;
  shadow: string;
  fontFamily: string;
  monoFontFamily: string;
  radius: number;
}

export interface PositionedNode extends DiagramNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositionedDiagram extends Omit<VisualFlowSpec, "nodes"> {
  nodes: PositionedNode[];
  width: number;
  height: number;
}

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface RenderOptions {
  theme?: string | Partial<VisualFlowTheme>;
  motion?: MotionMode;
  fitPadding?: number;
  background?: boolean;
  interactive?: boolean;
  className?: string;
  idPrefix?: string;
}

export interface RenderResult {
  svg: string;
  width: number;
  height: number;
  diagram: PositionedDiagram;
  theme: VisualFlowTheme;
}

export interface MountOptions extends RenderOptions {
  panZoom?: boolean;
}

export interface VisualFlowController {
  update(spec: VisualFlowSpec, options?: MountOptions): void;
  exportSvg(): string;
  destroy(): void;
}

export type RasterFormat = "png" | "jpeg" | "webp";
