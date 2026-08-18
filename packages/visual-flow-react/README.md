# `@sentimental37/visual-flow-react`

React 18/19 canvas and editing adapter for portable `@sentimental37/visual-flow` specifications. It provides pan/zoom, fit-to-view, controls, minimap, draggable nodes, connectable handles, selection, deletion, animated edges, and theme tokens without changing the saved JSON format.

```powershell
npm install @sentimental37/visual-flow @sentimental37/visual-flow-react react react-dom
```

Import the component and its CSS:

```tsx
import { VisualFlow } from "@sentimental37/visual-flow-react";
import "@sentimental37/visual-flow-react/styles.css";

export function Architecture({ spec }) {
  return (
    <div style={{ height: 720 }}>
      <VisualFlow
        spec={spec}
        editable
        onSpecChange={(next) => save(next)}
        onSelectionChange={(nodeId) => inspect(nodeId)}
      />
    </div>
  );
}
```

Set `editable={false}` for documentation and presentation views. In edit mode, moved nodes are persisted as a portable `manual` layout. Use `onCanvasDrop` to add palette-driven nodes at exact flow coordinates; Visual Flow Studio is the complete working example.

The adapter depends on React Flow for canvas interaction. The saved specification and SVG/HTML renderer remain framework-neutral, so consumers can replace the editor without migrating diagram data.

Next.js applications should use `@sentimental37/visual-flow-next`, which adds explicit Server Component and `"use client"` entry points while reusing this adapter.
