# Web framework integrations

LumeFlow keeps one versioned JSON model across every integration. Framework adapters own lifecycle and rendering boundaries; they do not fork the diagram format.

| Environment | Supported integration | Rendering behavior |
| --- | --- | --- |
| Browser / vanilla JS | `@lumeflow/core` | Direct SVG/HTML render, browser mount controller, or `<visual-flow>` custom element. |
| React 18 and 19 | `@lumeflow/react` | Interactive React Flow canvas with optional editing. |
| Next.js 14, 15, and 16 | `@lumeflow/next` | Server-safe static SVG plus an explicit client entry for interactivity. |
| Angular 17 through 22 | `@lumeflow/angular` | Standalone component, partial-Ivy package output, SSR import guard. |
| Vue 3 | Core custom element | Bind the `spec` property from a mounted component. |
| Svelte / SvelteKit | Core custom element | Define the element in the browser, then assign `spec`. |
| Solid | Core custom element | Define once and set the element property after mount. |
| Lit | Core custom element | Compose the registered `<visual-flow>` element. |
| Astro | Core custom element | Use a client island when pan/zoom is required; static SVG works without hydration. |
| Any server | Core renderer | Generate deterministic SVG or self-contained HTML without a DOM. |

## Standards-based custom element

```ts
import { defineVisualFlowElement } from "@lumeflow/core/element";

defineVisualFlowElement();
const diagram = document.querySelector("visual-flow");
diagram.spec = visualFlowSpec;
diagram.options = { panZoom: true };
```

The custom-element module is safe to import during SSR. Call `defineVisualFlowElement()` only in a browser.

## Browser support

The packages target modern evergreen browsers with ES2022 module support. Static SVG and standalone HTML remain the broadest deployment option. Interactive editing depends on browser Pointer Events, ResizeObserver, and current SVG/CSS behavior.
