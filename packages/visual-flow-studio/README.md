# Visual Flow Studio

Private demonstration and builder workspace for the publishable Visual Flow packages.

```powershell
npm run dev --workspace @sentimental37/visual-flow-studio
```

The Studio demonstrates:

- drag/drop component creation and handle-to-handle connections;
- node movement, selection, deletion, and automatic Dagre layout;
- diagram and node inspectors;
- built-in themes plus live design-token customization;
- portable JSON editing and validation;
- JSON, SVG, standalone HTML, PNG, and WebP export;
- cloud-commerce and governed-agent starter diagrams;
- local draft recovery without a backend.

The Studio is deliberately private. Applications consume the public `visual-flow`, `visual-flow-react`, and `visual-flow-cli` packages rather than depending on this demo workspace.
