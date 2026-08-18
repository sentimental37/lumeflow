import type { VisualFlowSpec } from "@lumeflow/core";

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

export interface LayoutFeature {
  mode: "manual" | "grid" | "lanes" | "dagre";
  title: string;
  description: string;
  bestFor: string;
  spec: VisualFlowSpec;
}

const featureNodes = [
  { id: "request", label: "Request", description: "Start", variant: "client" as const, icon: "01" },
  { id: "policy", label: "Policy", description: "Guard", variant: "security" as const, icon: "02" },
  { id: "service", label: "Service", description: "Process", variant: "service" as const, icon: "03" },
  { id: "result", label: "Result", description: "Complete", variant: "event" as const, icon: "04" },
];

const featureEdges = [
  { from: "request", to: "policy", variant: "accent" as const },
  { from: "policy", to: "service", variant: "warning" as const },
  { from: "service", to: "result", variant: "success" as const },
];

export const layoutFeatureDemos: readonly LayoutFeature[] = [
  {
    mode: "dagre",
    title: "Dagre",
    description: "Dependency-aware automatic ranking.",
    bestFor: "Architecture and dependency maps",
    spec: {
      schemaVersion: 1,
      id: "layout-dagre",
      kind: "architecture",
      title: "Dagre layout",
      layout: { mode: "dagre", direction: "LR", margin: 48, rankSeparation: 54, nodeSeparation: 32, nodeWidth: 150, nodeHeight: 72 },
      nodes: featureNodes,
      edges: featureEdges,
    },
  },
  {
    mode: "grid",
    title: "Grid",
    description: "Predictable row and column placement.",
    bestFor: "Catalogues and capability matrices",
    spec: {
      schemaVersion: 1,
      id: "layout-grid",
      kind: "dataflow",
      title: "Grid layout",
      layout: { mode: "grid", direction: "LR", columns: 2, margin: 48, gapX: 44, gapY: 36, nodeWidth: 150, nodeHeight: 72 },
      nodes: featureNodes,
      edges: featureEdges,
    },
  },
  {
    mode: "lanes",
    title: "Lanes",
    description: "Ownership and hand-offs made explicit.",
    bestFor: "Journeys and operational workflows",
    spec: {
      schemaVersion: 1,
      id: "layout-lanes",
      kind: "workflow",
      title: "Lane layout",
      layout: { mode: "lanes", direction: "LR", margin: 48, gapX: 44, gapY: 24, nodeWidth: 150, nodeHeight: 72 },
      lanes: [
        { id: "front", label: "Experience", order: 0 },
        { id: "back", label: "Platform", order: 1 },
      ],
      nodes: [
        { ...featureNodes[0], lane: "front" },
        { ...featureNodes[1], lane: "back" },
        { ...featureNodes[2], lane: "back" },
        { ...featureNodes[3], lane: "front" },
      ],
      edges: featureEdges,
    },
  },
  {
    mode: "manual",
    title: "Manual",
    description: "Exact, source-controlled coordinates.",
    bestFor: "Curated storytelling and custom editors",
    spec: {
      schemaVersion: 1,
      id: "layout-manual",
      kind: "lifecycle",
      title: "Manual layout",
      layout: { mode: "manual", direction: "LR", margin: 48 },
      nodes: [
        { ...featureNodes[0], x: 60, y: 110, width: 150, height: 72 },
        { ...featureNodes[1], x: 270, y: 65, width: 150, height: 72 },
        { ...featureNodes[2], x: 270, y: 175, width: 150, height: 72 },
        { ...featureNodes[3], x: 480, y: 110, width: 150, height: 72 },
      ],
      edges: [
        { from: "request", to: "policy", variant: "accent" },
        { from: "request", to: "service", variant: "warning" },
        { from: "policy", to: "result", variant: "success" },
        { from: "service", to: "result", variant: "success" },
      ],
    },
  },
] as const;

export const routeGallery: VisualFlowSpec = {
  schemaVersion: 1,
  id: "connector-route-gallery",
  kind: "workflow",
  title: "Connector Route Gallery",
  description: "Four routing strategies using the same portable edge contract.",
  layout: { mode: "manual", direction: "LR", margin: 48 },
  nodes: [
    { id: "s1", label: "Straight", description: "Direct signal", x: 70, y: 105, width: 180, height: 76, variant: "client", icon: "ST" },
    { id: "t1", label: "Destination", description: "No bends", x: 520, y: 105, width: 180, height: 76, variant: "service", icon: "01" },
    { id: "s2", label: "Bezier", description: "Fluid curve", x: 70, y: 225, width: 180, height: 76, variant: "client", icon: "BZ" },
    { id: "t2", label: "Destination", description: "Soft motion", x: 520, y: 275, width: 180, height: 76, variant: "event", icon: "02" },
    { id: "s3", label: "Orthogonal", description: "Hard corners", x: 810, y: 105, width: 180, height: 76, variant: "data", icon: "OR" },
    { id: "t3", label: "Destination", description: "Right angles", x: 1260, y: 225, width: 180, height: 76, variant: "security", icon: "03" },
    { id: "s4", label: "Smooth step", description: "Rounded elbows", x: 810, y: 345, width: 180, height: 76, variant: "external", icon: "SS" },
    { id: "t4", label: "Destination", description: "Presentation ready", x: 1260, y: 345, width: 180, height: 76, variant: "event", icon: "04" },
  ],
  edges: [
    { from: "s1", to: "t1", label: "straight", route: "straight", variant: "accent" },
    { from: "s2", to: "t2", label: "bezier", route: "bezier", variant: "success", animated: true },
    { from: "s3", to: "t3", label: "orthogonal", route: "orthogonal", variant: "warning" },
    { from: "s4", to: "t4", label: "smoothstep", route: "smoothstep", variant: "accent", animated: true, particles: 3 },
  ],
  motion: "flow",
};

export const variantGallery: VisualFlowSpec = {
  schemaVersion: 1,
  id: "semantic-variant-gallery",
  kind: "architecture",
  title: "Semantic Visual Language",
  description: "Node roles and edge states carry meaning without custom renderers.",
  layout: { mode: "grid", direction: "LR", columns: 4, margin: 54, gapX: 54, gapY: 54, nodeWidth: 188, nodeHeight: 84 },
  nodes: [
    { id: "client", label: "Client", description: "User-facing surface", variant: "client", badges: ["client"] },
    { id: "service", label: "Service", description: "Business capability", variant: "service", badges: ["service"] },
    { id: "security", label: "Security", description: "Trust boundary", variant: "security", badges: ["security"] },
    { id: "data", label: "Data", description: "State and insight", variant: "data", badges: ["data"] },
    { id: "event", label: "Event", description: "Durable change", variant: "event", badges: ["event"] },
    { id: "decision", label: "Decision", description: "Explicit choice", variant: "decision", badges: ["decision"] },
    { id: "external", label: "External", description: "Outside dependency", variant: "external", badges: ["external"] },
    { id: "default", label: "Default", description: "Neutral component", variant: "default", badges: ["default"] },
  ],
  edges: [
    { from: "client", to: "service", label: "accent", variant: "accent", animated: true },
    { from: "service", to: "security", label: "warning", variant: "warning" },
    { from: "security", to: "data", label: "success", variant: "success" },
    { from: "event", to: "decision", label: "danger", variant: "danger" },
    { from: "decision", to: "external", label: "muted", variant: "muted" },
    { from: "external", to: "default", label: "default", variant: "default" },
  ],
  motion: "trace",
};

export const capabilityAtlas: VisualFlowSpec = {
  schemaVersion: 1,
  id: "visual-flow-capability-atlas",
  kind: "architecture",
  title: "LumeFlow · Capability Atlas",
  description: "The complete path from portable diagram data to authoring, framework delivery, automation, and export.",
  layout: { mode: "manual", direction: "LR", margin: 76 },
  theme: "midnight-current",
  motion: "flow",
  nodes: [
    { id: "json", label: "Portable JSON", description: "Versioned source", x: 80, y: 130, width: 214, height: 82, variant: "data", icon: "{}", badges: ["schema v1"] },
    { id: "types", label: "TypeScript Types", description: "Strong contracts", x: 80, y: 270, width: 214, height: 82, variant: "data", icon: "TS" },
    { id: "schema", label: "JSON Schema", description: "Editor tooling", x: 80, y: 410, width: 214, height: 82, variant: "data", icon: "JS" },
    { id: "mermaid", label: "Mermaid Import", description: "Migration bridge", x: 80, y: 550, width: 214, height: 82, variant: "external", icon: "MM" },

    { id: "validate", label: "Validation", description: "Errors + warnings", x: 390, y: 100, width: 214, height: 82, variant: "security", icon: "OK" },
    { id: "layout", label: "Layout Engine", description: "Four strategies", x: 390, y: 220, width: 214, height: 82, variant: "service", icon: "LY" },
    { id: "routing", label: "Smart Routing", description: "Four connector styles", x: 390, y: 340, width: 214, height: 82, variant: "service", icon: "RT" },
    { id: "themes", label: "Theme Engine", description: "18 design tokens", x: 390, y: 460, width: 214, height: 82, variant: "decision", icon: "TH" },
    { id: "motion", label: "Motion Engine", description: "None, trace, flow", x: 390, y: 580, width: 214, height: 82, variant: "event", icon: "FX" },
    { id: "a11y", label: "Accessible SVG", description: "Names + descriptions", x: 390, y: 700, width: 214, height: 82, variant: "security", icon: "A11" },

    { id: "server", label: "Server Renderer", description: "DOM-free SVG", x: 700, y: 130, width: 214, height: 82, variant: "service", icon: "SR" },
    { id: "mount", label: "Browser Mount", description: "Update + destroy", x: 700, y: 270, width: 214, height: 82, variant: "client", icon: "DOM" },
    { id: "element", label: "Custom Element", description: "Standards based", x: 700, y: 410, width: 214, height: 82, variant: "client", icon: "CE" },
    { id: "panzoom", label: "Pan + Zoom", description: "Pointer interaction", x: 700, y: 550, width: 214, height: 82, variant: "client", icon: "PZ" },
    { id: "html", label: "Standalone HTML", description: "Portable artifact", x: 700, y: 690, width: 214, height: 82, variant: "event", icon: "<>" },

    { id: "angular", label: "Angular 17–22", description: "Standalone + SSR", x: 1010, y: 100, width: 214, height: 82, variant: "client", icon: "NG", badges: ["native"] },
    { id: "react", label: "React 18–19", description: "Editable canvas", x: 1010, y: 220, width: 214, height: 82, variant: "client", icon: "RE" },
    { id: "next", label: "Next.js 14–16", description: "Server + client", x: 1010, y: 340, width: 214, height: 82, variant: "client", icon: "NX" },
    { id: "web", label: "Vue · Svelte · Solid", description: "Custom element", x: 1010, y: 460, width: 214, height: 82, variant: "external", icon: "WEB" },
    { id: "astro", label: "Astro · Lit", description: "Static or island", x: 1010, y: 580, width: 214, height: 82, variant: "external", icon: "AL" },

    { id: "studio", label: "LumeFlow Studio", description: "Complete builder", x: 1320, y: 100, width: 214, height: 82, variant: "service", icon: "VS" },
    { id: "drag", label: "Drag + Drop", description: "Exact placement", x: 1320, y: 220, width: 214, height: 82, variant: "client", icon: "DD" },
    { id: "inspectors", label: "Inspectors", description: "Diagram + node", x: 1320, y: 340, width: 214, height: 82, variant: "decision", icon: "IN" },
    { id: "livejson", label: "Live JSON", description: "Validate as you type", x: 1320, y: 460, width: 214, height: 82, variant: "data", icon: "{}" },
    { id: "drafts", label: "Local Drafts", description: "Crash recovery", x: 1320, y: 580, width: 214, height: 82, variant: "data", icon: "DR" },

    { id: "vector", label: "SVG Export", description: "Infinite fidelity", x: 1630, y: 100, width: 214, height: 82, variant: "event", icon: "SVG" },
    { id: "raster", label: "PNG · JPEG · WebP", description: "Canvas export", x: 1630, y: 220, width: 214, height: 82, variant: "event", icon: "IMG" },
    { id: "cli", label: "CLI + CI", description: "Validate and render", x: 1630, y: 340, width: 214, height: 82, variant: "service", icon: "CLI" },
    { id: "agents", label: "Agent Skill", description: "Diagram-first output", x: 1630, y: 460, width: 214, height: 82, variant: "decision", icon: "AI" },
    { id: "git", label: "Source Control", description: "Reviewable changes", x: 1630, y: 580, width: 214, height: 82, variant: "security", icon: "GIT" },
  ],
  groups: [
    { id: "contract", label: "01 · PORTABLE CONTRACT", nodeIds: ["json", "types", "schema", "mermaid"], variant: "region" },
    { id: "engine", label: "02 · CORE ENGINE", nodeIds: ["validate", "layout", "routing", "themes", "motion", "a11y"], variant: "emphasis" },
    { id: "runtime", label: "03 · RUNTIME", nodeIds: ["server", "mount", "element", "panzoom", "html"], variant: "region" },
    { id: "frameworks", label: "04 · FRAMEWORKS", nodeIds: ["angular", "react", "next", "web", "astro"], variant: "emphasis" },
    { id: "authoring", label: "05 · AUTHORING", nodeIds: ["studio", "drag", "inspectors", "livejson", "drafts"], variant: "region" },
    { id: "delivery", label: "06 · DELIVERY", nodeIds: ["vector", "raster", "cli", "agents", "git"], variant: "security" },
  ],
  edges: [
    { from: "json", to: "validate", label: "read", variant: "accent", animated: true },
    { from: "types", to: "validate", label: "type", variant: "muted" },
    { from: "schema", to: "validate", label: "lint", variant: "muted" },
    { from: "mermaid", to: "json", label: "migrate", variant: "warning" },
    { from: "validate", to: "layout", label: "valid spec", variant: "success" },
    { from: "layout", to: "routing", label: "positions", variant: "accent", animated: true },
    { from: "routing", to: "themes", label: "geometry", variant: "accent" },
    { from: "themes", to: "motion", label: "tokens", variant: "accent" },
    { from: "motion", to: "a11y", label: "reduced motion", variant: "success" },
    { from: "routing", to: "server", label: "render", variant: "accent", animated: true },
    { from: "themes", to: "mount", label: "style", variant: "accent" },
    { from: "server", to: "mount", label: "hydrate", variant: "muted" },
    { from: "mount", to: "element", label: "wrap", variant: "accent" },
    { from: "mount", to: "panzoom", label: "interact", variant: "success" },
    { from: "server", to: "html", label: "package", variant: "success" },
    { from: "server", to: "angular", label: "SSR safe", variant: "accent", animated: true },
    { from: "mount", to: "react", label: "canvas", variant: "accent" },
    { from: "server", to: "next", label: "static", variant: "accent" },
    { from: "element", to: "web", label: "standards", variant: "success" },
    { from: "element", to: "astro", label: "island", variant: "success" },
    { from: "react", to: "studio", label: "powers", variant: "accent", animated: true },
    { from: "studio", to: "drag", label: "author", variant: "accent" },
    { from: "drag", to: "inspectors", label: "select", variant: "accent" },
    { from: "inspectors", to: "livejson", label: "sync", variant: "accent" },
    { from: "livejson", to: "drafts", label: "persist", variant: "success" },
    { from: "server", to: "vector", label: "SVG", variant: "success", animated: true },
    { from: "mount", to: "raster", label: "canvas", variant: "success" },
    { from: "json", to: "cli", label: "automate", variant: "accent" },
    { from: "schema", to: "agents", label: "guide", variant: "warning" },
    { from: "livejson", to: "git", label: "commit", variant: "success" },
    { from: "cli", to: "git", label: "gate", variant: "success" },
    { from: "agents", to: "git", label: "review", variant: "warning" },
  ],
  annotations: [
    { id: "portable", text: "One contract · every renderer", x: 760, y: 82, variant: "info" },
    { id: "source", text: "Data stays framework-neutral", x: 1320, y: 700, variant: "note" },
  ],
};
