# `@lumeflow/cli`

Validate, inspect, migrate, and export portable LumeFlow diagrams in developer workflows and CI.

```powershell
npm install --save-dev @lumeflow/cli
npx lumeflow validate docs/diagrams/sources/platform.visual-flow.json
npx lumeflow render docs/diagrams/sources/platform.visual-flow.json --format html --output docs/diagrams/platform.html
npx lumeflow inspect docs/diagrams/sources/platform.visual-flow.json
```

Generate the JSON Schema for editor integration:

```powershell
npx lumeflow schema --output visual-flow.schema.json
```

Mermaid is supported as a migration input, not as the persisted or rendered format:

```powershell
npx lumeflow migrate-mermaid old-flow.mmd --title "Order workflow" --output order-workflow.visual-flow.json
```

The migration preserves basic topology and labels for Mermaid flowcharts, sequence diagrams, and state diagrams. It intentionally does not copy Mermaid styling; review the generated layout, semantic variants, groups, and main narrative in LumeFlow Studio before publishing.

The CLI writes SVG and self-contained HTML. PNG, JPEG, and WebP export are available in the browser renderer and Studio, where a native canvas is available.
