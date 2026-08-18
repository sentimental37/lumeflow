export interface ApiEntry {
  name: string;
  signature: string;
  description: string;
  returns?: string;
  notes?: string;
}

export interface ApiPackage {
  id: string;
  label: string;
  packageName: string;
  summary: string;
  install: string;
  entries: readonly ApiEntry[];
}

export interface SchemaField {
  field: string;
  type: string;
  required: boolean;
  defaultValue: string;
  description: string;
}

export interface SchemaGroup {
  id: string;
  label: string;
  typeName: string;
  fields: readonly SchemaField[];
}

export interface FrameworkSupport {
  name: string;
  versions: string;
  integration: string;
  mode: string;
  editing: string;
}

export interface CodeSample {
  id: string;
  label: string;
  language: string;
  code: string;
}

export const apiPackages: readonly ApiPackage[] = [
  {
    id: "core",
    label: "Core",
    packageName: "@sentimental37/visual-flow",
    summary: "Framework-neutral contracts, layout, rendering, validation, themes, browser mounting, and exports.",
    install: "npm install @sentimental37/visual-flow",
    entries: [
      {
        name: "renderVisualFlow",
        signature: "renderVisualFlow(spec: VisualFlowSpec, options?: RenderOptions): RenderResult",
        description: "Validates layout inputs, resolves the theme, and creates deterministic accessible SVG markup.",
        returns: "SVG string, dimensions, positioned diagram, and resolved theme.",
        notes: "DOM-free and safe to run on servers, in build tools, or in browser code.",
      },
      {
        name: "layoutVisualFlow",
        signature: "layoutVisualFlow(spec: VisualFlowSpec): PositionedDiagram",
        description: "Computes deterministic node coordinates using manual, grid, lanes, or Dagre-style ranking.",
        returns: "The original diagram contract with positioned nodes plus width and height.",
      },
      {
        name: "freezeVisualFlowLayout",
        signature: "freezeVisualFlowLayout(spec: VisualFlowSpec): VisualFlowSpec",
        description: "Materializes an automatic layout into explicit coordinates and switches the copy to manual mode.",
        returns: "A portable specification ready for editor movement or curated positioning.",
      },
      {
        name: "validateVisualFlow",
        signature: "validateVisualFlow(value: unknown): ValidationResult",
        description: "Checks required fields, enum values, node and edge references, duplicate identifiers, groups, and manual positions.",
        returns: "{ valid, issues } with error and readability-warning severity.",
      },
      {
        name: "assertVisualFlow",
        signature: "assertVisualFlow(value: unknown): asserts value is VisualFlowSpec",
        description: "Type-narrowing validation helper for application and pipeline boundaries.",
        notes: "Throws one readable error containing every validation failure.",
      },
      {
        name: "resolveTheme",
        signature: "resolveTheme(input?: string | Partial<VisualFlowTheme>): VisualFlowTheme",
        description: "Resolves a built-in name or merges partial overrides onto a complete theme.",
        returns: "A complete eighteen-token theme object.",
      },
      {
        name: "serializeVisualFlow",
        signature: "serializeVisualFlow(spec: VisualFlowSpec, space = 2): string",
        description: "Creates stable, newline-terminated JSON suitable for source control.",
      },
      {
        name: "renderStandaloneHtml",
        signature: "renderStandaloneHtml(spec: VisualFlowSpec, options?: RenderOptions): string",
        description: "Packages the diagram, controls, theme toggle, and browser exports into one self-contained HTML file.",
      },
      {
        name: "renderRasterBlob",
        signature: "renderRasterBlob(spec, format?: 'png' | 'jpeg' | 'webp', options?: RenderOptions & RasterOptions): Promise<Blob>",
        description: "Rasterizes generated SVG through the browser canvas at a bounded scale and quality.",
        notes: "Browser DOM required. Scale is clamped from 0.5 to 4.",
      },
      {
        name: "downloadVisualFlow",
        signature: "downloadVisualFlow(spec, format: 'json' | 'svg' | 'html' | 'png' | 'jpeg' | 'webp', options?): Promise<void>",
        description: "Downloads any supported source, vector, standalone, or raster artifact.",
      },
      {
        name: "mountVisualFlow",
        signature: "mountVisualFlow(container: Element, spec: VisualFlowSpec, options?: MountOptions): VisualFlowController",
        description: "Mounts the SVG into an element and optionally wires wheel zoom and pointer panning.",
        returns: "Controller with update(), exportSvg(), and destroy().",
      },
      {
        name: "defineVisualFlowElement",
        signature: "defineVisualFlowElement(tagName = 'visual-flow'): typeof VisualFlowElement",
        description: "Idempotently registers the standards-based custom element for any web framework.",
        notes: "Call in a browser; the module itself remains safe to import during SSR.",
      },
      {
        name: "VISUAL_FLOW_SCHEMA",
        signature: "const VISUAL_FLOW_SCHEMA: JSONSchema202012",
        description: "Bundled JSON Schema for editors, CI validation, code generation, and agent tooling.",
      },
    ],
  },
  {
    id: "angular",
    label: "Angular",
    packageName: "@sentimental37/visual-flow-angular",
    summary: "Native standalone Angular lifecycle adapter with strict templates and an SSR guard.",
    install: "npm install @sentimental37/visual-flow @sentimental37/visual-flow-angular",
    entries: [
      {
        name: "VisualFlowAngularComponent",
        signature: "standalone component · selector: visual-flow-diagram",
        description: "Owns browser mounting, input updates, event emission, controller cleanup, and accessible host naming.",
        notes: "Published in Angular Package Format with partial-Ivy metadata for Angular 17–22.",
      },
      {
        name: "spec",
        signature: "@Input({ required: true }) spec: VisualFlowSpec",
        description: "The portable diagram contract. Input changes update the existing controller.",
      },
      {
        name: "options",
        signature: "@Input() options: MountOptions = { panZoom: true }",
        description: "Theme, motion, background, class, identifier prefix, and pan/zoom behavior.",
      },
      {
        name: "visualFlowReady",
        signature: "@Output() visualFlowReady: EventEmitter<VisualFlowController>",
        description: "Emitted after the first successful browser mount.",
      },
      {
        name: "visualFlowError",
        signature: "@Output() visualFlowError: EventEmitter<unknown>",
        description: "Emitted when rendering or mounting fails so the host application chooses its recovery UI.",
      },
      {
        name: "exportSvg",
        signature: "exportSvg(): string",
        description: "Returns the currently rendered SVG through a ViewChild reference.",
      },
    ],
  },
  {
    id: "react",
    label: "React",
    packageName: "@sentimental37/visual-flow-react",
    summary: "React 18/19 read-only and editable canvas powered by React Flow while preserving the portable contract.",
    install: "npm install @sentimental37/visual-flow @sentimental37/visual-flow-react react react-dom",
    entries: [
      {
        name: "VisualFlow",
        signature: "<VisualFlow spec={spec} editable onSpecChange={save} />",
        description: "Provider-backed canvas with pan, zoom, fit view, controls, minimap, selection, deletion, connections, and drag/drop.",
      },
      {
        name: "VisualFlowProps",
        signature: "{ spec, editable?, fitView?, showControls?, showMiniMap?, showBackground?, theme?, onSpecChange?, onSelectionChange?, onCanvasDrop? }",
        description: "Controls presentation and editing without changing the saved diagram schema.",
      },
      {
        name: "toReactFlowNodes",
        signature: "toReactFlowNodes(spec: VisualFlowSpec, editable = false): VisualFlowCanvasNode[]",
        description: "Converts positioned portable nodes into React Flow canvas nodes.",
      },
      {
        name: "toReactFlowEdges",
        signature: "toReactFlowEdges(spec: VisualFlowSpec): VisualFlowCanvasEdge[]",
        description: "Converts portable edges, variants, markers, and motion into canvas edges.",
      },
    ],
  },
  {
    id: "next",
    label: "Next.js",
    packageName: "@sentimental37/visual-flow-next",
    summary: "Explicit server and client entries for App Router, Pages Router, static export, and self-hosted Next.js.",
    install: "npm install @sentimental37/visual-flow-next react react-dom next",
    entries: [
      {
        name: "VisualFlowStatic",
        signature: "<VisualFlowStatic spec={spec} options={options} />",
        description: "Server-safe component for SEO, documentation, static export, and read-only routes.",
      },
      {
        name: "VisualFlowClient",
        signature: "import { VisualFlowClient } from '@sentimental37/visual-flow-next/client'",
        description: "Client boundary for editing and interaction with deterministic SVG during server and first client render.",
        notes: "Hydrates the React Flow canvas only after mount to avoid server/client drift.",
      },
      {
        name: "staticFallback",
        signature: "staticFallback?: boolean = true",
        description: "Controls whether the client entry shows server-generated SVG while the interactive canvas mounts.",
      },
    ],
  },
  {
    id: "element",
    label: "Web Component",
    packageName: "@sentimental37/visual-flow/element",
    summary: "Standards-based integration for Vue, Svelte, Solid, Lit, Astro islands, and plain browser applications.",
    install: "npm install @sentimental37/visual-flow",
    entries: [
      {
        name: "spec",
        signature: "element.spec: VisualFlowSpec | undefined",
        description: "Property-based contract assignment; also supports an embedded application/json script on connection.",
      },
      {
        name: "pan-zoom",
        signature: "attribute pan-zoom='true' | 'false'",
        description: "Observed attribute that updates the mounted controller behavior.",
      },
      {
        name: "visual-flow-ready",
        signature: "CustomEvent<VisualFlowController>",
        description: "Fires after the first successful render.",
      },
      {
        name: "visual-flow-error",
        signature: "CustomEvent<unknown>",
        description: "Reports malformed declarative JSON and rendering failures.",
      },
      {
        name: "exportSvg",
        signature: "element.exportSvg(): string",
        description: "Returns the current SVG without framework-specific APIs.",
      },
    ],
  },
  {
    id: "cli",
    label: "CLI",
    packageName: "@sentimental37/visual-flow-cli",
    summary: "Portable validation, inspection, schema generation, Mermaid migration, and deterministic rendering for CI.",
    install: "npm install --save-dev @sentimental37/visual-flow-cli",
    entries: [
      {
        name: "validate",
        signature: "visual-flow validate <diagram.visual-flow.json>",
        description: "Prints every issue and exits non-zero when the source contract is invalid.",
      },
      {
        name: "render",
        signature: "visual-flow render <input> --format svg|html|json --output <file>",
        description: "Renders source-controlled artifacts without a browser.",
      },
      {
        name: "inspect",
        signature: "visual-flow inspect <diagram.visual-flow.json>",
        description: "Prints final dimensions and positioned node geometry for diagnostics and automation.",
      },
      {
        name: "schema",
        signature: "visual-flow schema [--output visual-flow.schema.json]",
        description: "Writes or prints the bundled JSON Schema.",
      },
      {
        name: "migrate-mermaid",
        signature: "visual-flow migrate-mermaid <diagram.mmd> --title <title> --output <file>",
        description: "Migrates basic flowchart, sequence, and state topology into the portable contract for review in Studio.",
      },
    ],
  },
] as const;

export const schemaGroups: readonly SchemaGroup[] = [
  {
    id: "spec",
    label: "Diagram",
    typeName: "VisualFlowSpec",
    fields: [
      { field: "schemaVersion", type: "1", required: true, defaultValue: "—", description: "Contract version. The current and only accepted value is 1." },
      { field: "id", type: "string", required: true, defaultValue: "—", description: "Stable diagram identifier used for SVG identifiers and export filenames." },
      { field: "kind", type: "architecture | workflow | dataflow | sequence | lifecycle", required: true, defaultValue: "—", description: "Semantic diagram category." },
      { field: "title", type: "string", required: true, defaultValue: "—", description: "Visible heading and accessible SVG title." },
      { field: "description", type: "string", required: false, defaultValue: "generated", description: "Accessible long description and narrative summary." },
      { field: "layout", type: "DiagramLayout", required: false, defaultValue: "dagre / LR", description: "Positioning strategy and spacing controls." },
      { field: "theme", type: "string | Partial<VisualFlowTheme>", required: false, defaultValue: "midnight-current", description: "Built-in theme name or token overrides." },
      { field: "motion", type: "none | trace | flow", required: false, defaultValue: "none", description: "Diagram-wide particle behavior; reduced-motion preferences remain respected." },
      { field: "nodes", type: "DiagramNode[]", required: true, defaultValue: "—", description: "Components, activities, states, or actors." },
      { field: "edges", type: "DiagramEdge[]", required: true, defaultValue: "—", description: "Directed relationships between node identifiers." },
      { field: "groups", type: "DiagramGroup[]", required: false, defaultValue: "[]", description: "Computed visual boundaries around related nodes." },
      { field: "lanes", type: "DiagramLane[]", required: false, defaultValue: "[]", description: "Ordered ownership lanes for lane layouts." },
      { field: "annotations", type: "DiagramAnnotation[]", required: false, defaultValue: "[]", description: "Positioned note, info, or warning call-outs." },
      { field: "metadata", type: "VisualFlowMetadata", required: false, defaultValue: "{}", description: "Owner, tags, and application-defined source metadata." },
    ],
  },
  {
    id: "node",
    label: "Node",
    typeName: "DiagramNode",
    fields: [
      { field: "id", type: "string", required: true, defaultValue: "—", description: "Unique identifier referenced by edges, groups, and editor selection." },
      { field: "label", type: "string", required: true, defaultValue: "—", description: "Primary visible and accessible name." },
      { field: "description", type: "string", required: false, defaultValue: "—", description: "Secondary line beneath the label." },
      { field: "variant", type: "default | service | client | data | security | event | decision | external", required: false, defaultValue: "default", description: "Semantic role mapped to the visual language." },
      { field: "icon", type: "string", required: false, defaultValue: "initials", description: "Short text shown in the icon shell." },
      { field: "x / y", type: "number", required: false, defaultValue: "computed", description: "Required coordinates in manual layout; generated elsewhere." },
      { field: "width / height", type: "number", required: false, defaultValue: "layout defaults", description: "Per-node dimension overrides." },
      { field: "row / column", type: "number", required: false, defaultValue: "source order", description: "Grid or lane stage placement hints." },
      { field: "lane", type: "string", required: false, defaultValue: "first lane", description: "Owning lane identifier." },
      { field: "group", type: "string", required: false, defaultValue: "—", description: "Application metadata for group membership; visual groups use nodeIds." },
      { field: "badges", type: "string[]", required: false, defaultValue: "[]", description: "Up to two compact node badges are rendered." },
      { field: "metadata", type: "Record<string, unknown>", required: false, defaultValue: "{}", description: "Non-rendered domain data for applications and builders." },
    ],
  },
  {
    id: "edge",
    label: "Edge",
    typeName: "DiagramEdge",
    fields: [
      { field: "id", type: "string", required: false, defaultValue: "from--to", description: "Stable edge identity; explicit values are recommended when endpoints may repeat." },
      { field: "from / to", type: "string", required: true, defaultValue: "—", description: "Existing source and target node identifiers." },
      { field: "label", type: "string", required: false, defaultValue: "—", description: "Relationship text placed at the connector midpoint." },
      { field: "variant", type: "default | accent | success | warning | danger | muted", required: false, defaultValue: "default", description: "Semantic state controlling line and arrow color." },
      { field: "route", type: "straight | bezier | orthogonal | smoothstep", required: false, defaultValue: "smoothstep", description: "Connector geometry strategy." },
      { field: "animated", type: "boolean", required: false, defaultValue: "motion dependent", description: "Explicitly enables or disables traveling particles." },
      { field: "particles", type: "number", required: false, defaultValue: "1", description: "Particle count clamped from one through four." },
      { field: "metadata", type: "Record<string, unknown>", required: false, defaultValue: "{}", description: "Application-specific relationship data." },
    ],
  },
  {
    id: "layout",
    label: "Layout",
    typeName: "DiagramLayout",
    fields: [
      { field: "mode", type: "manual | grid | lanes | dagre", required: true, defaultValue: "—", description: "Deterministic positioning algorithm." },
      { field: "direction", type: "LR | RL | TB | BT", required: false, defaultValue: "LR", description: "Primary flow direction and preferred connector ports." },
      { field: "margin", type: "number", required: false, defaultValue: "76", description: "Outer diagram canvas padding." },
      { field: "gapX / gapY", type: "number", required: false, defaultValue: "72 / 56", description: "Horizontal and vertical spacing for grid and lane layouts." },
      { field: "columns", type: "number", required: false, defaultValue: "3", description: "Grid column count." },
      { field: "nodeWidth / nodeHeight", type: "number", required: false, defaultValue: "196 / 86", description: "Default component dimensions." },
      { field: "rankSeparation", type: "number", required: false, defaultValue: "96", description: "Distance between automatic dependency ranks." },
      { field: "nodeSeparation", type: "number", required: false, defaultValue: "52", description: "Distance between nodes within an automatic rank." },
    ],
  },
  {
    id: "theme",
    label: "Theme",
    typeName: "VisualFlowTheme",
    fields: [
      { field: "name", type: "string", required: true, defaultValue: "—", description: "Theme identity and light/dark integration hint." },
      { field: "background / backgroundAlt", type: "CSS color", required: true, defaultValue: "—", description: "Canvas and secondary background layers." },
      { field: "surface / surfaceElevated", type: "CSS color", required: true, defaultValue: "—", description: "Node, label, and elevated surfaces." },
      { field: "border / borderStrong", type: "CSS color", required: true, defaultValue: "—", description: "Subtle and emphasized structural lines." },
      { field: "text / textMuted", type: "CSS color", required: true, defaultValue: "—", description: "Primary and supporting typography." },
      { field: "accent / accentSecondary", type: "CSS color", required: true, defaultValue: "—", description: "Primary and secondary emphasis colors." },
      { field: "success / warning / danger", type: "CSS color", required: true, defaultValue: "—", description: "Semantic status colors." },
      { field: "grid", type: "CSS color", required: true, defaultValue: "—", description: "Background grid line color." },
      { field: "shadow", type: "CSS color", required: true, defaultValue: "—", description: "Node shadow color, including alpha." },
      { field: "fontFamily / monoFontFamily", type: "CSS font-family", required: true, defaultValue: "—", description: "Interface and code/metadata typography." },
      { field: "radius", type: "number", required: true, defaultValue: "16", description: "Theme corner radius token in pixels." },
    ],
  },
  {
    id: "options",
    label: "Options",
    typeName: "RenderOptions · MountOptions",
    fields: [
      { field: "theme", type: "string | Partial<VisualFlowTheme>", required: false, defaultValue: "spec.theme", description: "Per-render theme override." },
      { field: "motion", type: "none | trace | flow", required: false, defaultValue: "spec.motion", description: "Per-render motion override." },
      { field: "fitPadding", type: "number", required: false, defaultValue: "—", description: "Reserved public fit-to-view padding option." },
      { field: "background", type: "boolean", required: false, defaultValue: "true", description: "Shows or removes the SVG grid layer." },
      { field: "interactive", type: "boolean", required: false, defaultValue: "false", description: "Marks output intended for interactive standalone rendering." },
      { field: "className", type: "string", required: false, defaultValue: "—", description: "Additional SVG root classes." },
      { field: "idPrefix", type: "string", required: false, defaultValue: "spec.id", description: "Prefix for accessible labels, markers, and SVG identifiers." },
      { field: "panZoom", type: "boolean", required: false, defaultValue: "true", description: "Mount-only wheel zoom and pointer panning control." },
    ],
  },
] as const;

export const frameworkSupport: readonly FrameworkSupport[] = [
  { name: "Angular", versions: "17–22", integration: "Native standalone component", mode: "SSR guarded + interactive", editing: "Read-only adapter" },
  { name: "React", versions: "18–19", integration: "Native React Flow canvas", mode: "Client interactive", editing: "Full editing" },
  { name: "Next.js", versions: "14–16", integration: "Server + client entry points", mode: "Static, SSR, hydrated", editing: "Client entry" },
  { name: "Vue", versions: "3+", integration: "Custom element", mode: "Client or island", editing: "Builder separate" },
  { name: "Svelte / SvelteKit", versions: "Current", integration: "Custom element", mode: "Client or island", editing: "Builder separate" },
  { name: "Solid", versions: "Current", integration: "Custom element", mode: "Client", editing: "Builder separate" },
  { name: "Lit", versions: "Current", integration: "Custom element composition", mode: "Client", editing: "Builder separate" },
  { name: "Astro", versions: "Current", integration: "Static SVG or client island", mode: "Static + hydrated", editing: "Builder separate" },
  { name: "Vanilla web", versions: "ES2022", integration: "Mount API or custom element", mode: "Static + interactive", editing: "Controller integration" },
  { name: "Node / any server", versions: "Node 20.19+", integration: "Core renderer + CLI", mode: "DOM-free SVG / HTML", editing: "Source transformations" },
] as const;

export const codeSamples: readonly CodeSample[] = [
  {
    id: "angular",
    label: "Angular",
    language: "typescript",
    code: `import { Component } from "@angular/core";
import { VisualFlowAngularComponent } from "@sentimental37/visual-flow-angular";

@Component({
  standalone: true,
  imports: [VisualFlowAngularComponent],
  template: \`
    <visual-flow-diagram
      [spec]="architecture"
      [options]="{ panZoom: true, theme: customTheme }"
      (visualFlowReady)="onReady($event)"
      (visualFlowError)="onError($event)"
    />
  \`,
})
export class ArchitecturePage {}`,
  },
  {
    id: "core",
    label: "Core renderer",
    language: "typescript",
    code: `import {
  renderVisualFlow,
  validateVisualFlow,
  type VisualFlowSpec,
} from "@sentimental37/visual-flow";

const validation = validateVisualFlow(spec);
if (!validation.valid) throw new Error("Invalid diagram");

const { svg, width, height, diagram, theme } =
  renderVisualFlow(spec, { background: true });`,
  },
  {
    id: "theme",
    label: "Custom theme",
    language: "typescript",
    code: `const auroraTheme = {
  name: "aurora",
  accent: "#2dd4bf",
  accentSecondary: "#818cf8",
  surface: "#0f1f2e",
  surfaceElevated: "#142a3d",
  borderStrong: "#40657a",
  radius: 20,
};

renderVisualFlow(spec, {
  theme: auroraTheme,
  motion: "flow",
});`,
  },
  {
    id: "element",
    label: "Web component",
    language: "typescript",
    code: `import { defineVisualFlowElement }
  from "@sentimental37/visual-flow/element";

defineVisualFlowElement();

const element = document.querySelector("visual-flow");
element.spec = architectureSpec;
element.setAttribute("pan-zoom", "true");
element.addEventListener("visual-flow-ready", onReady);`,
  },
  {
    id: "cli",
    label: "CLI + CI",
    language: "powershell",
    code: `npx visual-flow validate architecture.visual-flow.json
npx visual-flow inspect architecture.visual-flow.json
npx visual-flow render architecture.visual-flow.json ` +
      `--format svg --output docs/architecture.svg
npx visual-flow schema --output visual-flow.schema.json`,
  },
] as const;
