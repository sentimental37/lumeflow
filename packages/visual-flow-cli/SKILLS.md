# `@sentimental37/visual-flow-cli` skills

Purpose: executable validation, layout inspection, export, schema generation, and Mermaid migration for Visual Flow sources.

Minimum verification:

```powershell
npm run build
npm run typecheck
npm test
```

Safe-change notes:

- Keep commands deterministic and non-interactive for CI and agent use.
- Never silently render an invalid source specification.
- Treat Mermaid migration as topology import; do not claim style or semantic fidelity.
