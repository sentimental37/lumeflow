import type { DiagramNode, VisualFlowSpec } from "@sentimental37/visual-flow";

export const palette: Array<Pick<DiagramNode, "variant" | "label" | "description" | "icon">> = [
  { variant: "client", label: "Client / UI", description: "Browser, desktop, or operator", icon: "UI" },
  { variant: "service", label: "Service / API", description: "Backend capability or endpoint", icon: "AP" },
  { variant: "data", label: "Data Store", description: "Database, cache, or directory", icon: "DB" },
  { variant: "security", label: "Security Gate", description: "Identity, policy, or authorization", icon: "SG" },
  { variant: "event", label: "Event / Queue", description: "Stream, topic, or async signal", icon: "EV" },
  { variant: "decision", label: "Decision", description: "Branch, approval, or outcome", icon: "?" },
  { variant: "external", label: "External System", description: "Third-party or boundary system", icon: "EX" },
];

const platform: VisualFlowSpec = {
  schemaVersion: 1,
  id: "cloud-commerce-studio",
  kind: "architecture",
  title: "Cloud Commerce Platform",
  description: "A live order journey from storefront to fulfillment and insight.",
  layout: { mode: "dagre", direction: "LR", rankSeparation: 130, nodeSeparation: 72 },
  theme: "midnight-current",
  motion: "flow",
  nodes: [
    { id: "shopper", label: "Shopper", description: "Web and mobile", variant: "client", icon: "SH", badges: ["React"] },
    { id: "storefront", label: "Storefront", description: "Personalized catalog", variant: "client", icon: "UI", badges: ["Next.js"] },
    { id: "gateway", label: "API Gateway", description: "Edge routing", variant: "security", icon: "GW" },
    { id: "orders", label: "Order Service", description: "Checkout + lifecycle", variant: "service", icon: "OS" },
    { id: "payments", label: "Payment Provider", description: "Secure authorization", variant: "external", icon: "PX" },
    { id: "events", label: "Event Stream", description: "Durable order events", variant: "event", icon: "EV", badges: ["Kafka"] },
    { id: "fulfillment", label: "Fulfillment", description: "Inventory + shipping", variant: "service", icon: "FX" },
    { id: "warehouse", label: "Analytics Lake", description: "Operational insight", variant: "data", icon: "DB" },
  ],
  edges: [
    { from: "shopper", to: "storefront", label: "browse", variant: "accent", animated: true },
    { from: "storefront", to: "gateway", label: "checkout", variant: "accent", animated: true },
    { from: "gateway", to: "orders", label: "create order", variant: "accent", animated: true, particles: 2 },
    { from: "orders", to: "payments", label: "authorize", variant: "warning", route: "bezier" },
    { from: "orders", to: "events", label: "order placed", variant: "success", animated: true },
    { from: "events", to: "fulfillment", label: "reserve + ship", variant: "success", animated: true },
    { from: "events", to: "warehouse", label: "stream", variant: "accent", animated: true },
  ],
  groups: [{ id: "platform", label: "Owned commerce platform", nodeIds: ["storefront", "gateway", "orders", "events", "fulfillment", "warehouse"], variant: "emphasis" }],
};

const agent: VisualFlowSpec = {
  schemaVersion: 1,
  id: "ai-agent-run-studio",
  kind: "dataflow",
  title: "AI Agent Run",
  description: "A governed agent turns intent into a reviewed, observable result.",
  layout: { mode: "grid", direction: "LR", columns: 4, gapX: 88, gapY: 82 },
  theme: "porcelain-light",
  motion: "none",
  nodes: [
    { id: "prompt", label: "User Intent", description: "Goal + context", variant: "client", row: 0, column: 0 },
    { id: "knowledge", label: "Knowledge Base", description: "Grounded sources", variant: "data", row: 1, column: 0 },
    { id: "planner", label: "Agent Planner", description: "Plan + delegation", variant: "service", row: 0, column: 1 },
    { id: "policy", label: "Policy Guard", description: "Tools + permissions", variant: "security", row: 1, column: 1 },
    { id: "tools", label: "Tool Runtime", description: "APIs and sandboxes", variant: "external", row: 0, column: 2 },
    { id: "review", label: "Human Review", description: "Approve sensitive work", variant: "decision", row: 1, column: 2 },
    { id: "result", label: "Verified Result", description: "Answer + evidence", variant: "event", row: 0, column: 3 },
    { id: "trace", label: "Run Trace", description: "Steps, cost, lineage", variant: "data", row: 1, column: 3 },
  ],
  edges: [
    { from: "prompt", to: "planner", label: "request", variant: "accent" },
    { from: "knowledge", to: "planner", label: "context", variant: "accent" },
    { from: "planner", to: "policy", label: "proposed action", variant: "warning" },
    { from: "policy", to: "tools", label: "scoped call", variant: "accent" },
    { from: "tools", to: "review", label: "sensitive change", variant: "warning" },
    { from: "review", to: "result", label: "approved", variant: "success" },
    { from: "result", to: "trace", label: "evidence", variant: "muted" },
  ],
};

const blank: VisualFlowSpec = {
  schemaVersion: 1,
  id: "new-visual-flow",
  kind: "architecture",
  title: "Untitled Visual Flow",
  description: "Drag components from the palette, then connect their handles.",
  layout: { mode: "manual", direction: "LR" },
  theme: "midnight-current",
  motion: "flow",
  nodes: [],
  edges: [],
};

export const templates = { platform, agent, blank } as const;

export function cloneTemplate(name: keyof typeof templates): VisualFlowSpec {
  return structuredClone(templates[name]);
}
