import type { VisualFlowSpec } from "@lumeflow/core";

export type DemoKey = "commerce" | "events" | "agent";

export interface DemoDiagram {
  eyebrow: string;
  summary: string;
  stat: string;
  spec: VisualFlowSpec;
}

export const demos: Record<DemoKey, DemoDiagram> = {
  commerce: {
    eyebrow: "Reference architecture",
    summary: "A live order journey from storefront to fulfillment and insight.",
    stat: "8 components · 7 connections",
    spec: {
      schemaVersion: 1,
      id: "gallery-cloud-commerce",
      kind: "architecture",
      title: "Cloud Commerce Platform",
      description: "A live order journey from storefront to fulfillment and insight.",
      layout: { mode: "dagre", direction: "LR", rankSeparation: 112, nodeSeparation: 62 },
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
    },
  },
  events: {
    eyebrow: "Event workflow",
    summary: "Durable events connect customer experience, platform, and operations.",
    stat: "3 lanes · replayable events",
    spec: {
      schemaVersion: 1,
      id: "gallery-event-order",
      kind: "workflow",
      title: "Event-Driven Order Journey",
      description: "Independent teams collaborate through durable events.",
      layout: { mode: "lanes", direction: "LR", gapX: 74, gapY: 34 },
      theme: "executive-slate",
      motion: "trace",
      lanes: [
        { id: "experience", label: "Customer experience", order: 0 },
        { id: "platform", label: "Commerce platform", order: 1 },
        { id: "operations", label: "Operations", order: 2 },
      ],
      nodes: [
        { id: "cart", label: "Submit Cart", description: "Web checkout", lane: "experience", variant: "client", icon: "01" },
        { id: "order", label: "Create Order", description: "Validated command", lane: "platform", variant: "service", icon: "02" },
        { id: "payment", label: "Authorize Payment", description: "Idempotent request", lane: "platform", variant: "security", icon: "03" },
        { id: "publish", label: "Publish Event", description: "Order accepted", lane: "platform", variant: "event", icon: "04" },
        { id: "reserve", label: "Reserve Stock", description: "Inventory hold", lane: "operations", variant: "data", icon: "05" },
        { id: "ship", label: "Create Shipment", description: "Trackable delivery", lane: "operations", variant: "external", icon: "06" },
      ],
      edges: [
        { from: "cart", to: "order", label: "checkout", variant: "accent", animated: true },
        { from: "order", to: "payment", label: "authorize", variant: "warning", route: "smoothstep" },
        { from: "payment", to: "publish", label: "approved", variant: "success" },
        { from: "publish", to: "reserve", label: "order.accepted", variant: "accent", animated: true },
        { from: "reserve", to: "ship", label: "stock held", variant: "success", animated: true },
      ],
    },
  },
  agent: {
    eyebrow: "Agentic system",
    summary: "Intent becomes a grounded, policy-checked, human-reviewed result.",
    stat: "8 steps · complete run trace",
    spec: {
      schemaVersion: 1,
      id: "gallery-agent-run",
      kind: "dataflow",
      title: "Governed AI Agent Run",
      description: "A governed agent turns intent into a reviewed, observable result.",
      layout: { mode: "grid", direction: "LR", columns: 4, gapX: 70, gapY: 58 },
      theme: "porcelain-light",
      motion: "none",
      nodes: [
        { id: "prompt", label: "User Intent", description: "Goal + context", variant: "client", row: 0, column: 0 },
        { id: "knowledge", label: "Knowledge Base", description: "Grounded sources", variant: "data", row: 1, column: 0 },
        { id: "planner", label: "Agent Planner", description: "Plan + delegation", variant: "service", row: 0, column: 1 },
        { id: "policy", label: "Policy Guard", description: "Tools + permissions", variant: "security", row: 1, column: 1 },
        { id: "tools", label: "Tool Runtime", description: "APIs + sandboxes", variant: "external", row: 0, column: 2 },
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
    },
  },
};
