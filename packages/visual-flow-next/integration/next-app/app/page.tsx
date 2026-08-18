import { VisualFlowStatic, type VisualFlowSpec } from "@sentimental37/visual-flow-next";
import { VisualFlowClient } from "@sentimental37/visual-flow-next/client";

const spec: VisualFlowSpec = {
  schemaVersion: 1,
  id: "next-integration",
  kind: "architecture",
  title: "Next.js integration",
  layout: { mode: "dagre", direction: "LR" },
  nodes: [
    { id: "server", label: "Server Component", variant: "service" },
    { id: "client", label: "Client Canvas", variant: "client" },
  ],
  edges: [{ from: "server", to: "client", animated: true }],
};

export default function Page() {
  return (
    <main>
      <VisualFlowStatic spec={spec} />
      <div style={{ height: 520 }}>
        <VisualFlowClient spec={spec} showMiniMap={false} />
      </div>
    </main>
  );
}
