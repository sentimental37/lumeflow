# `@lumeflow/core` skills

Purpose: the framework-neutral LumeFlow contract, validation, layout, SVG rendering, themes, motion, and exports.

Minimum verification:

```powershell
npm run build
npm run typecheck
npm test
```

Safe-change notes:

- Treat `VisualFlowSpec` and `schemaVersion` as public contracts.
- Keep layout deterministic and renderer output free of executable user content.
- Preserve reduced-motion behavior and accessible SVG names/descriptions.
- Add or update source JSON examples instead of editing generated SVG or HTML.
