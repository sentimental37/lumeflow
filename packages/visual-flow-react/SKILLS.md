# `@lumeflow/react` skills

Purpose: React canvas and editing adapter over the framework-neutral LumeFlow model.

Minimum verification:

```powershell
npm run build
npm run typecheck
npm test
```

Safe-change notes:

- Keep saved data in `VisualFlowSpec`; never persist React Flow's internal graph format.
- Keep framework peers external and the internal LumeFlow core bundled for distribution.
- Verify keyboard deletion, drag, connect, selection, zoom, light theme, dark theme, and reduced motion when interactions change.
