"use client";

import { useEffect, useState } from "react";
import { renderVisualFlow } from "@sentimental37/visual-flow";
import {
  VisualFlow,
  type VisualFlowProps,
} from "@sentimental37/visual-flow-react";
import "./styles.css";

export interface VisualFlowClientProps extends VisualFlowProps {
  /** Render deterministic SVG until the interactive canvas mounts. */
  staticFallback?: boolean;
}

/**
 * Client boundary for editable, pannable, zoomable Next.js diagrams. The first
 * server and client render use the same deterministic SVG to avoid hydration
 * drift; React Flow is mounted after hydration.
 */
export function VisualFlowClient({ staticFallback = true, ...props }: VisualFlowClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    const svg = staticFallback ? renderVisualFlow(props.spec, { theme: props.theme }).svg : "";
    return (
      <section
        className={`vfn-fallback ${props.className ?? ""}`}
        style={props.style}
        aria-label={`${props.spec.title} diagram`}
        aria-busy="true"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return <VisualFlow {...props} />;
}

export type { VisualFlowProps } from "@sentimental37/visual-flow-react";
