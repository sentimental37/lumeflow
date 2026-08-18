# LumeFlow v1 specification guide

The TypeScript contract in `packages/visual-flow/src/types.ts` and runtime validator in `packages/visual-flow/src/schema.ts` are authoritative. This guide is the compact authoring reference for agents.

## Minimal source

```json
{
  "schemaVersion": 1,
  "id": "request-path",
  "kind": "workflow",
  "title": "Request path",
  "description": "How a trusted request reaches an application service.",
  "layout": { "mode": "dagre", "direction": "LR" },
  "theme": "midnight-current",
  "motion": "none",
  "nodes": [
    { "id": "client", "label": "Client", "variant": "client" },
    { "id": "api", "label": "API", "variant": "service" }
  ],
  "edges": [
    { "from": "client", "to": "api", "label": "HTTPS", "variant": "accent", "route": "smoothstep" }
  ]
}
```

## Top-level fields

| Field | Values and intent |
| --- | --- |
| `schemaVersion` | Always `1` for the current contract. |
| `id` | Stable lowercase kebab-case artifact ID. |
| `kind` | `architecture`, `workflow`, `dataflow`, `sequence`, or `lifecycle`. |
| `title` | Short, reader-facing title. |
| `description` | One sentence that explains scope and narrative. |
| `layout.mode` | `dagre`, `lanes`, `grid`, or `manual`. |
| `layout.direction` | `LR`, `RL`, `TB`, or `BT`. |
| `theme` | `midnight-current`, `porcelain-light`, `executive-slate`, or a theme-token object. |
| `motion` | `none`, `trace`, or `flow`. |

## Node fields

Every node needs `id` and `label`. Use `description` for one concise subline.

| Variant | Use for |
| --- | --- |
| `client` | People, web/mobile/desktop clients, portals, and user surfaces. |
| `service` | APIs, microservices, workers, and platform capabilities. |
| `data` | Databases, caches, directories, object stores, and warehouses. |
| `security` | Identity, authorization, policy, trust boundaries, and secrets. |
| `event` | Queues, topics, streams, webhooks, and notable emitted outcomes. |
| `decision` | Approval, routing, allow/deny, and explicit branch logic. |
| `external` | Third-party or out-of-scope systems. |
| `default` | Neutral component only when no semantic variant fits. |

Optional visual fields are `icon` (one or two text characters), `badges` (at most two short values), `width`, and `height`. Layout-specific fields are `x`/`y`, `row`/`column`, and `lane`.

## Edge fields

- `from` and `to` must reference node IDs.
- Use `label` only when the transition is not obvious.
- Routes are `straight`, `bezier`, `orthogonal`, and `smoothstep`.
- Variants are `default`, `accent`, `success`, `warning`, `danger`, and `muted`.
- Set `animated: true` and optional `particles: 1..4` only for a meaningful live path.

## Groups and lanes

Groups wrap `nodeIds` and use `default`, `security`, `region`, or `emphasis`. A group should communicate a real ownership, trust, deployment, or scope boundary.

Lane layouts require a `lanes` array. Give every lane a stable `id`, reader-facing `label`, and optional `order`; set each participating node's `lane` field. Use lanes for actors, teams, execution environments, or lifecycle bands.

## Layout choice

- Start with `dagre` for component maps and simple workflows.
- Use `lanes` when ownership or boundary crossings are part of the story.
- Use `grid` for a deliberate matrix, presentation, or stage/row design.
- Use `manual` for art direction and builder output; every node then needs numeric `x` and `y`.

The renderer measures the final node boxes and group bounds. Keep the story readable rather than maximizing node density.

## Commands

```powershell
node packages/visual-flow-cli/dist/cli.js validate <source.visual-flow.json>
node packages/visual-flow-cli/dist/cli.js inspect <source.visual-flow.json>
node packages/visual-flow-cli/dist/cli.js render <source.visual-flow.json> --format svg --output <output.svg>
node packages/visual-flow-cli/dist/cli.js render <source.visual-flow.json> --format html --output <output.html>
```
