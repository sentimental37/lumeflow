import type { CSSProperties } from "react";
import {
  renderVisualFlow,
  type RenderOptions,
  type VisualFlowSpec,
} from "@sentimental37/visual-flow";

export interface VisualFlowStaticProps {
  spec: VisualFlowSpec;
  options?: RenderOptions;
  className?: string;
  style?: CSSProperties;
}

/**
 * Server-safe diagram component for Next.js Server Components, static exports,
 * metadata pages, and routes that do not need client-side editing.
 */
export function VisualFlowStatic({ spec, options, className, style }: VisualFlowStaticProps) {
  const rendered = renderVisualFlow(spec, options);
  return (
    <section
      className={className}
      style={style}
      aria-label={`${spec.title} diagram`}
      dangerouslySetInnerHTML={{ __html: rendered.svg }}
    />
  );
}

export {
  renderStandaloneHtml,
  renderVisualFlow,
  serializeVisualFlow,
  validateVisualFlow,
} from "@sentimental37/visual-flow";
export type {
  RenderOptions,
  VisualFlowSpec,
  VisualFlowTheme,
} from "@sentimental37/visual-flow";
