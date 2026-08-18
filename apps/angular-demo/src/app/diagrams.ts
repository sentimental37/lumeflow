import type { VisualFlowSpec } from "@sentimental37/visual-flow";

export type AngularDemoKey = "platform" | "events" | "intelligence";

export interface AngularDemo {
  key: AngularDemoKey;
  label: string;
  kicker: string;
  summary: string;
  metric: string;
  spec: VisualFlowSpec;
}

export const angularDemos: readonly AngularDemo[] = [
  {
    key: "platform",
    label: "Digital platform",
    kicker: "Reference architecture",
    summary: "A composable customer platform with secure APIs and event-driven operations.",
    metric: "8 components · 7 live paths",
    spec: {
      schemaVersion: 1,
      id: "angular-digital-platform",
      kind: "architecture",
      title: "Composable Digital Platform",
      description: "A secure journey from experience to insight.",
      layout: { mode: "dagre", direction: "LR", rankSeparation: 110, nodeSeparation: 62 },
      theme: "midnight-current",
      motion: "flow",
      nodes: [
        { id: "customer", label: "Customer", description: "Web + mobile", variant: "client", icon: "01" },
        { id: "experience", label: "Experience", description: "Angular shell", variant: "client", icon: "NG", badges: ["Angular"] },
        { id: "edge", label: "Edge Gateway", description: "Routing + policy", variant: "security", icon: "GW" },
        { id: "identity", label: "Identity", description: "Consent + sessions", variant: "security", icon: "ID" },
        { id: "domain", label: "Domain APIs", description: "Business capabilities", variant: "service", icon: "AP" },
        { id: "stream", label: "Event Stream", description: "Durable changes", variant: "event", icon: "EV" },
        { id: "partners", label: "Partner Network", description: "External services", variant: "external", icon: "PX" },
        { id: "insight", label: "Insight Store", description: "Realtime analytics", variant: "data", icon: "DB" },
      ],
      edges: [
        { from: "customer", to: "experience", label: "interact", variant: "accent", animated: true },
        { from: "experience", to: "edge", label: "request", variant: "accent", animated: true },
        { from: "edge", to: "identity", label: "authorize", variant: "warning" },
        { from: "edge", to: "domain", label: "route", variant: "accent", animated: true },
        { from: "domain", to: "partners", label: "coordinate", variant: "muted" },
        { from: "domain", to: "stream", label: "publish", variant: "success", animated: true },
        { from: "stream", to: "insight", label: "project", variant: "success", animated: true },
      ],
    },
  },
  {
    key: "events",
    label: "Event journey",
    kicker: "Operational workflow",
    summary: "A durable order lifecycle shared cleanly across experience, platform, and operations.",
    metric: "3 lanes · replayable state",
    spec: {
      schemaVersion: 1,
      id: "angular-event-journey",
      kind: "workflow",
      title: "Event-Driven Order Journey",
      description: "Independent teams collaborate through durable events.",
      layout: { mode: "lanes", direction: "LR", gapX: 76, gapY: 34 },
      theme: "executive-slate",
      motion: "trace",
      lanes: [
        { id: "experience", label: "Customer experience", order: 0 },
        { id: "platform", label: "Commerce platform", order: 1 },
        { id: "operations", label: "Operations", order: 2 },
      ],
      nodes: [
        { id: "cart", label: "Submit Cart", description: "Angular checkout", lane: "experience", variant: "client", icon: "01" },
        { id: "order", label: "Create Order", description: "Validated command", lane: "platform", variant: "service", icon: "02" },
        { id: "payment", label: "Authorize", description: "Idempotent payment", lane: "platform", variant: "security", icon: "03" },
        { id: "publish", label: "Publish Event", description: "Order accepted", lane: "platform", variant: "event", icon: "04" },
        { id: "reserve", label: "Reserve Stock", description: "Inventory hold", lane: "operations", variant: "data", icon: "05" },
        { id: "ship", label: "Create Shipment", description: "Trackable delivery", lane: "operations", variant: "external", icon: "06" },
      ],
      edges: [
        { from: "cart", to: "order", label: "checkout", variant: "accent", animated: true },
        { from: "order", to: "payment", label: "authorize", variant: "warning" },
        { from: "payment", to: "publish", label: "approved", variant: "success" },
        { from: "publish", to: "reserve", label: "order.accepted", variant: "accent", animated: true },
        { from: "reserve", to: "ship", label: "stock held", variant: "success", animated: true },
      ],
    },
  },
  {
    key: "intelligence",
    label: "AI operations",
    kicker: "Governed intelligence",
    summary: "An observable decision flow with grounded context, policy gates, and human approval.",
    metric: "8 stages · complete trace",
    spec: {
      schemaVersion: 1,
      id: "angular-ai-operations",
      kind: "dataflow",
      title: "Governed Intelligence Loop",
      description: "Intent becomes a reviewed, observable outcome.",
      layout: { mode: "grid", direction: "LR", columns: 4, gapX: 68, gapY: 58 },
      theme: "porcelain-light",
      motion: "none",
      nodes: [
        { id: "intent", label: "User Intent", description: "Goal + context", variant: "client", row: 0, column: 0 },
        { id: "knowledge", label: "Knowledge", description: "Grounded sources", variant: "data", row: 1, column: 0 },
        { id: "planner", label: "Planner", description: "Structured approach", variant: "service", row: 0, column: 1 },
        { id: "policy", label: "Policy Gate", description: "Scope + permissions", variant: "security", row: 1, column: 1 },
        { id: "tools", label: "Tool Runtime", description: "Bounded actions", variant: "external", row: 0, column: 2 },
        { id: "review", label: "Human Review", description: "Sensitive decisions", variant: "decision", row: 1, column: 2 },
        { id: "result", label: "Verified Result", description: "Answer + evidence", variant: "event", row: 0, column: 3 },
        { id: "trace", label: "Run Trace", description: "Steps + lineage", variant: "data", row: 1, column: 3 },
      ],
      edges: [
        { from: "intent", to: "planner", label: "request", variant: "accent" },
        { from: "knowledge", to: "planner", label: "context", variant: "accent" },
        { from: "planner", to: "policy", label: "proposed action", variant: "warning" },
        { from: "policy", to: "tools", label: "scoped call", variant: "accent" },
        { from: "tools", to: "review", label: "sensitive change", variant: "warning" },
        { from: "review", to: "result", label: "approved", variant: "success" },
        { from: "result", to: "trace", label: "evidence", variant: "muted" },
      ],
    },
  },
] as const;
