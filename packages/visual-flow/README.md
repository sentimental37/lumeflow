# `@sentimental37/visual-flow`

Framework-neutral diagram-as-data for polished architecture, workflow, data-flow, sequence, and lifecycle visuals. A versioned JSON specification drives deterministic layouts, accessible SVG, lightweight motion, standalone HTML, raster export, custom elements, Angular, React, Next.js, the CLI, and Visual Flow Studio.

## Install

```powershell
npm install @sentimental37/visual-flow
```

## Render one specification everywhere

```ts
import { renderVisualFlow, renderStandaloneHtml } from "@sentimental37/visual-flow";

const spec = {
  schemaVersion: 1,
  id: "order-path",
  kind: "workflow",
  title: "Order path",
  layout: { mode: "dagre", direction: "LR" },
  theme: "midnight-current",
  motion: "flow",
  nodes: [
    { id: "ui", label: "Trading UI", variant: "client" },
    { id: "api", label: "Order API", variant: "service" }
  ],
  edges: [{ from: "ui", to: "api", label: "submit", variant: "accent", animated: true }]
};

const { svg } = renderVisualFlow(spec);
const html = renderStandaloneHtml(spec);
```

Layouts are `manual`, `grid`, `lanes`, and `dagre`. Edge routes are `straight`, `bezier`, `orthogonal`, and `smoothstep`. The renderer escapes labels, emits accessible SVG title/description content, and disables visible motion when the user prefers reduced motion.

Before an editor adds or moves a node in an automatic layout, call `freezeVisualFlowLayout(spec)` to materialize every computed coordinate and safely switch the source to `manual` mode.

## Browser and custom element

```ts
import { mountVisualFlow } from "@sentimental37/visual-flow";

const controller = mountVisualFlow(document.querySelector("#diagram")!, spec, { panZoom: true });
controller.update(nextSpec);
```

```ts
import { defineVisualFlowElement } from "@sentimental37/visual-flow/element";

defineVisualFlowElement();
document.querySelector("visual-flow").spec = spec;
```

The custom-element entry is safe to import during SSR; call `defineVisualFlowElement()` only in a browser. It emits `visual-flow-ready` with its controller and `visual-flow-error` when declarative JSON cannot be parsed. The same element is the supported integration path for Vue, Svelte, Solid, Lit, Astro islands, and other standards-based web frameworks. See the [web-framework guide](../../docs/VISUAL_FLOW_WEB_FRAMEWORKS.md).

## Export and themes

`downloadVisualFlow` exports JSON, SVG, standalone HTML, PNG, JPEG, and WebP in browsers. Built-in themes are `midnight-current`, `porcelain-light`, and `executive-slate`; pass a partial `VisualFlowTheme` to customize any token.

Runnable source specifications live in [`examples`](examples). Use `@sentimental37/visual-flow-cli` to validate and render them in CI, or Visual Flow Studio to edit them visually.

## Security boundary

Node labels and metadata are data, not HTML. The SVG renderer XML-escapes all visible values and does not evaluate scripts or arbitrary markup. Applications that add custom renderers remain responsible for sanitizing their own output.
