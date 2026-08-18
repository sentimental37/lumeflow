---
name: create-lumeflow-diagram
description: Create, edit, migrate, validate, and render polished source-controlled LumeFlow architecture, workflow, data-flow, sequence, and lifecycle diagrams as JSON plus SVG or standalone HTML. Use when a task asks for architecture diagrams, technical flows, system maps, data pipelines, request sequences, state machines, a diagram to replace Mermaid, or a Mermaid diagram to beautify and migrate.
---

# Create LumeFlow Diagram

Create diagrams from portable `*.visual-flow.json` sources using the repository's LumeFlow packages. Treat the JSON as the source of truth and generated SVG/HTML as review or publication artifacts.

## Select the diagram kind

- Use `architecture` for components, services, boundaries, infrastructure, and system relationships.
- Use `workflow` for processes, approvals, runbooks, launch journeys, and operator flows.
- Use `dataflow` for data lineage, ingestion, ETL, PII boundaries, and event pipelines.
- Use `sequence` for chronological calls, request lifecycles, and participant interactions.
- Use `lifecycle` for state machines, retries, wait states, and terminal outcomes.

Read [references/specification.md](references/specification.md) before creating or materially changing a diagram. Copy [assets/starter.visual-flow.json](assets/starter.visual-flow.json) when starting from an empty design.

## Create a diagram

1. Inspect the relevant implementation, contracts, and existing documentation. Do not infer runtime relationships from names alone.
2. Plan one visual narrative. Keep the main path obvious, make side branches short, and group security or platform boundaries.
3. Create a source under the closest maintained diagram source directory, normally `docs/diagrams/sources/<name>.visual-flow.json`.
4. Choose semantic node variants and sparse edge labels. Use `accent` for the main path, `danger` for authorization or failure, `warning` for risk/policy, and `muted` for secondary/asynchronous paths.
5. Use `dagre` for a first automatic layout, `lanes` for ownership/process bands, `grid` for presentation structure, or `manual` only for deliberately art-directed coordinates.
6. Default to `motion: "none"` for repository documentation. Use `trace` or `flow` only for a demo or when motion was requested.
7. Validate and render with the helper:

```powershell
node agent-skills/create-lumeflow-diagram/scripts/render-lumeflow.mjs docs/diagrams/sources/platform.visual-flow.json docs/diagrams
```

8. Open the rendered HTML or SVG and visually inspect the full canvas. Check labels, crossings, hierarchy, contrast, group bounds, dark/light presentation, and reduced-motion behavior.
9. Fix the JSON and regenerate. Never patch generated SVG or HTML when a source specification exists.

## Replace or migrate Mermaid

When Mermaid exists, read it for topology and meaning. Migrate it as an input dialect, then improve the visual narrative instead of preserving Mermaid styling:

```powershell
node packages/visual-flow-cli/dist/cli.js migrate-mermaid docs/old-flow.mmd --title "Application launch" --output docs/diagrams/sources/application-launch.visual-flow.json
```

Render the migrated source, review it, then update the containing documentation to link or embed the generated SVG/HTML. Keep the original Mermaid only when the user or the documentation platform explicitly requires Mermaid as a supported fallback.

## Edit an existing diagram

- Change the `*.visual-flow.json` source.
- Keep stable node IDs where meaning is unchanged so diffs and downstream links remain intelligible.
- Increment `schemaVersion` only with a coordinated public schema migration; the current value is `1`.
- Revalidate all edges and groups after renaming or deleting nodes.
- Regenerate every checked-in artifact produced from that source.

## Required quality gates

- The CLI `validate` command passes with no errors.
- The diagram contains an accessible title and useful description.
- Text is short enough to scan; use documentation for prose.
- Labels and metadata contain data only, never raw HTML or script.
- The primary path is visually stronger than secondary relationships.
- Layout is deterministic and source-controlled.
- SVG and standalone HTML render without a blank canvas or clipping.
- Motion is meaningful and remains non-essential because reduced-motion users will not see particles.

## Deliver

Provide links to the source JSON and generated artifacts. State the diagram kind, layout, theme, and validation result. Distinguish source-verified relationships from illustrative assumptions.

## Embed in web applications

- Use `@lumeflow/angular` for Angular standalone components.
- Use `@lumeflow/react` for React applications.
- Use `@lumeflow/next` for Next.js Server/Client Component boundaries.
- Use `@lumeflow/core/element` for Vue, Svelte, Solid, Lit, Astro islands, and plain web applications.
- Keep `*.visual-flow.json` as the source regardless of the host framework; do not translate the model into framework-specific graph state.
