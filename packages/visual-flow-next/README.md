# `@sentimental37/visual-flow-next`

Next.js adapter with separate server and client entry points. It supports the App Router and Pages Router without forcing every diagram into the client bundle.

```powershell
npm install @sentimental37/visual-flow-next react react-dom next
```

Use the server-safe component for documentation, SEO, static exports, and read-only diagrams:

```tsx
import { VisualFlowStatic } from "@sentimental37/visual-flow-next";

export default async function ArchitecturePage() {
  const spec = await loadArchitecture();
  return <VisualFlowStatic spec={spec} />;
}
```

Use the explicit client entry point for pan, zoom, editing, selection, drag/drop, or callbacks. Import its stylesheet from the root layout:

```tsx
// app/layout.tsx
import "@sentimental37/visual-flow-next/styles.css";
```

```tsx
// app/architecture/page.tsx — a Server Component may pass a plain JSON spec
import { VisualFlowClient } from "@sentimental37/visual-flow-next/client";

export default function Page() {
  return <div style={{ height: 720 }}><VisualFlowClient spec={spec} /></div>;
}
```

For editable callbacks, place the component inside your own `"use client"` component because functions cannot cross the Server Component boundary. `VisualFlowClient` renders deterministic SVG for the server and first client pass, then mounts the interactive React Flow canvas after hydration.

Pages Router applications can import `VisualFlowClient` from the same `./client` entry. The package does not depend on Vercel hosting APIs and works with self-hosted Next.js.
