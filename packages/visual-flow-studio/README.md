# LumeFlow Studio

Private demonstration and builder workspace for the publishable LumeFlow packages.

```powershell
npm run dev --workspace @lumeflow/studio
```

The Studio demonstrates:

- drag/drop component creation, an explicit target picker, and handle-to-handle connections;
- incoming/outgoing connection inspection and individual link removal;
- node movement, selection, deletion, and automatic Dagre layout;
- diagram and node inspectors;
- built-in themes plus live design-token customization;
- portable JSON editing and validation;
- JSON, SVG, standalone HTML, PNG, and WebP export;
- cloud-commerce and governed-agent starter diagrams;
- local draft recovery without a backend.

The Studio is deliberately private. Applications consume the public `@lumeflow/core`, `@lumeflow/react`, and `@lumeflow/cli` packages rather than depending on this demo workspace.
