import { layoutVisualFlow } from "./layout.js";
import { porcelainLight, resolveTheme } from "./themes.js";
import type { DiagramEdge, DiagramGroup, EdgeVariant, PositionedDiagram, PositionedNode, RenderOptions, RenderResult, VisualFlowSpec, VisualFlowTheme } from "./types.js";

function escapeXml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function safeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function cssVariables(theme: VisualFlowTheme): string {
  return [
    `--vf-background:${theme.background}`,
    `--vf-background-alt:${theme.backgroundAlt}`,
    `--vf-surface:${theme.surface}`,
    `--vf-surface-elevated:${theme.surfaceElevated}`,
    `--vf-border:${theme.border}`,
    `--vf-border-strong:${theme.borderStrong}`,
    `--vf-text:${theme.text}`,
    `--vf-text-muted:${theme.textMuted}`,
    `--vf-accent:${theme.accent}`,
    `--vf-accent-secondary:${theme.accentSecondary}`,
    `--vf-success:${theme.success}`,
    `--vf-warning:${theme.warning}`,
    `--vf-danger:${theme.danger}`,
    `--vf-grid:${theme.grid}`,
    `--vf-shadow:${theme.shadow}`,
    `--vf-radius:${theme.radius}px`,
    `--vf-font:${theme.fontFamily}`,
    `--vf-font-mono:${theme.monoFontFamily}`,
  ].join(";");
}

function style(theme: VisualFlowTheme): string {
  return `
    .vf-root{${cssVariables(theme)};font-family:var(--vf-font);background:var(--vf-background);color:var(--vf-text)}
    .vf-root[data-vf-theme="light"]{${cssVariables(porcelainLight)}}
    .vf-bg{fill:var(--vf-background)}.vf-grid-line{stroke:var(--vf-grid);stroke-width:1}
    .vf-title{fill:var(--vf-text);font-size:22px;font-weight:720;letter-spacing:-.3px}
    .vf-subtitle{fill:var(--vf-text-muted);font-size:11px;font-family:var(--vf-font-mono);letter-spacing:.08em;text-transform:uppercase}
    .vf-lane{fill:var(--vf-background-alt);stroke:var(--vf-border);stroke-width:1}.vf-lane-label{fill:var(--vf-text-muted);font:600 10px var(--vf-font-mono);letter-spacing:.12em;text-transform:uppercase}
    .vf-group{fill:var(--vf-surface);fill-opacity:.34;stroke:var(--vf-border-strong);stroke-width:1.25;stroke-dasharray:6 6}
    .vf-group.security{stroke:var(--vf-danger)}.vf-group.region{stroke:var(--vf-warning)}.vf-group.emphasis{stroke:var(--vf-accent)}
    .vf-group-label{fill:var(--vf-text-muted);font:650 10px var(--vf-font-mono);letter-spacing:.08em;text-transform:uppercase}
    .vf-edge{fill:none;stroke:var(--vf-border-strong);stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .vf-edge.accent{stroke:var(--vf-accent);stroke-width:2.1}.vf-edge.success{stroke:var(--vf-success)}.vf-edge.warning{stroke:var(--vf-warning)}.vf-edge.danger{stroke:var(--vf-danger)}.vf-edge.muted{stroke:var(--vf-border);stroke-dasharray:5 6}
    .vf-edge-label-bg{fill:var(--vf-background);stroke:var(--vf-border);stroke-width:1}.vf-edge-label{fill:var(--vf-text-muted);font:600 9px var(--vf-font-mono);letter-spacing:.02em}
    .vf-particle{fill:var(--vf-accent);filter:url(#vf-glow)}
    .vf-node-shadow{fill:var(--vf-shadow);opacity:.65}.vf-node{fill:var(--vf-surface);stroke:var(--vf-border);stroke-width:1.25}
    .vf-node.default{stroke:var(--vf-border)}.vf-node.service{stroke:var(--vf-accent-secondary)}.vf-node.client{stroke:var(--vf-accent)}.vf-node.data{stroke:var(--vf-warning)}.vf-node.security{stroke:var(--vf-danger)}.vf-node.event{stroke:var(--vf-success)}.vf-node.decision{stroke:var(--vf-warning)}.vf-node.external{stroke:var(--vf-border-strong);stroke-dasharray:5 4}
    .vf-node-rail{fill:var(--vf-accent)}.vf-node-rail.service{fill:var(--vf-accent-secondary)}.vf-node-rail.data,.vf-node-rail.decision{fill:var(--vf-warning)}.vf-node-rail.security{fill:var(--vf-danger)}.vf-node-rail.event{fill:var(--vf-success)}
    .vf-icon-shell{fill:var(--vf-surface-elevated);stroke:var(--vf-border);stroke-width:1}.vf-icon{fill:var(--vf-accent);font:750 10px var(--vf-font-mono);letter-spacing:.05em}
    .vf-node-label{fill:var(--vf-text);font-size:13px;font-weight:680}.vf-node-description{fill:var(--vf-text-muted);font-size:10px}.vf-badge{fill:var(--vf-background-alt);stroke:var(--vf-border);stroke-width:1}.vf-badge-text{fill:var(--vf-text-muted);font:650 8px var(--vf-font-mono)}
    .vf-annotation{fill:var(--vf-surface-elevated);stroke:var(--vf-border);stroke-width:1}.vf-annotation.warning{stroke:var(--vf-warning)}.vf-annotation-text{fill:var(--vf-text-muted);font:550 10px var(--vf-font)}
    @media(prefers-reduced-motion:reduce){.vf-particle{display:none}}
  `;
}

function wrapLabel(label: string, max = 24): string[] {
  if (label.length <= max) return [label];
  const words = label.split(/\s+/);
  const result: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > max && line) {
      result.push(line);
      line = word;
      if (result.length === 1) break;
    } else line = candidate;
  }
  if (line && result.length < 2) result.push(line);
  if (words.join(" ").length > result.join(" ").length) result[result.length - 1] = `${result[result.length - 1].slice(0, Math.max(1, max - 1))}…`;
  return result.slice(0, 2);
}

function edgePoints(source: PositionedNode, target: PositionedNode, direction: string): { sx: number; sy: number; tx: number; ty: number } {
  const horizontal = direction === "LR" || direction === "RL";
  if (horizontal) {
    const forward = target.x >= source.x;
    return {
      sx: forward ? source.x + source.width : source.x,
      sy: source.y + source.height / 2,
      tx: forward ? target.x : target.x + target.width,
      ty: target.y + target.height / 2,
    };
  }
  const forward = target.y >= source.y;
  return {
    sx: source.x + source.width / 2,
    sy: forward ? source.y + source.height : source.y,
    tx: target.x + target.width / 2,
    ty: forward ? target.y : target.y + target.height,
  };
}

function edgePath(edge: DiagramEdge, source: PositionedNode, target: PositionedNode, direction: string): string {
  const { sx, sy, tx, ty } = edgePoints(source, target, direction);
  const route = edge.route ?? "smoothstep";
  if (route === "straight") return `M ${sx} ${sy} L ${tx} ${ty}`;
  if (route === "orthogonal") {
    if (direction === "LR" || direction === "RL") {
      const mx = (sx + tx) / 2;
      return `M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${ty} L ${tx} ${ty}`;
    }
    const my = (sy + ty) / 2;
    return `M ${sx} ${sy} L ${sx} ${my} L ${tx} ${my} L ${tx} ${ty}`;
  }
  if (route === "bezier") {
    if (direction === "LR" || direction === "RL") {
      const curve = Math.max(64, Math.abs(tx - sx) * 0.45);
      const sign = tx >= sx ? 1 : -1;
      return `M ${sx} ${sy} C ${sx + curve * sign} ${sy}, ${tx - curve * sign} ${ty}, ${tx} ${ty}`;
    }
    const curve = Math.max(64, Math.abs(ty - sy) * 0.45);
    const sign = ty >= sy ? 1 : -1;
    return `M ${sx} ${sy} C ${sx} ${sy + curve * sign}, ${tx} ${ty - curve * sign}, ${tx} ${ty}`;
  }
  const radius = 18;
  if (direction === "LR" || direction === "RL") {
    const mx = (sx + tx) / 2;
    const sySign = ty >= sy ? 1 : -1;
    return `M ${sx} ${sy} L ${mx - radius} ${sy} Q ${mx} ${sy} ${mx} ${sy + radius * sySign} L ${mx} ${ty - radius * sySign} Q ${mx} ${ty} ${mx + radius} ${ty} L ${tx} ${ty}`;
  }
  const my = (sy + ty) / 2;
  const sxSign = tx >= sx ? 1 : -1;
  return `M ${sx} ${sy} L ${sx} ${my - radius} Q ${sx} ${my} ${sx + radius * sxSign} ${my} L ${tx - radius * sxSign} ${my} Q ${tx} ${my} ${tx} ${my + radius} L ${tx} ${ty}`;
}

function variantMarker(prefix: string, variant: EdgeVariant): string {
  return `url(#${prefix}-arrow-${variant})`;
}

function markerColor(variant: EdgeVariant): string {
  if (variant === "accent") return "var(--vf-accent)";
  if (variant === "success") return "var(--vf-success)";
  if (variant === "warning") return "var(--vf-warning)";
  if (variant === "danger") return "var(--vf-danger)";
  if (variant === "muted") return "var(--vf-border)";
  return "var(--vf-border-strong)";
}

function renderGroups(diagram: PositionedDiagram): string {
  const byId = new Map(diagram.nodes.map((node) => [node.id, node]));
  return (diagram.groups ?? []).map((group: DiagramGroup) => {
    const members = group.nodeIds.map((id) => byId.get(id)).filter((node): node is PositionedNode => Boolean(node));
    if (!members.length) return "";
    const padding = 32;
    const left = Math.min(...members.map((node) => node.x)) - padding;
    const top = Math.min(...members.map((node) => node.y)) - padding - 12;
    const right = Math.max(...members.map((node) => node.x + node.width)) + padding;
    const bottom = Math.max(...members.map((node) => node.y + node.height)) + padding;
    return `<g data-vf-group="${escapeXml(group.id)}"><rect class="vf-group ${escapeXml(group.variant ?? "default")}" x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" rx="20"/><text class="vf-group-label" x="${left + 16}" y="${top + 20}">${escapeXml(group.label)}</text></g>`;
  }).join("");
}

function renderLanes(diagram: PositionedDiagram): string {
  if (!diagram.lanes?.length || diagram.layout?.mode !== "lanes") return "";
  const horizontal = diagram.layout.direction === "LR" || diagram.layout.direction === "RL" || !diagram.layout.direction;
  return diagram.lanes.map((lane, index) => {
    const members = diagram.nodes.filter((node) => node.lane === lane.id);
    if (!members.length) return "";
    const pad = 28;
    const x = horizontal ? 24 : Math.min(...members.map((node) => node.x)) - pad;
    const y = horizontal ? Math.min(...members.map((node) => node.y)) - pad - 24 : 74;
    const width = horizontal ? diagram.width - 48 : Math.max(...members.map((node) => node.x + node.width)) - x + pad;
    const height = horizontal ? Math.max(...members.map((node) => node.y + node.height)) - y + pad : diagram.height - 98;
    return `<g data-vf-lane="${escapeXml(lane.id)}"><rect class="vf-lane" x="${x}" y="${y}" width="${width}" height="${height}" rx="20" opacity="${index % 2 ? ".7" : ".48"}"/><text class="vf-lane-label" x="${x + 16}" y="${y + 20}">${escapeXml(lane.label)}</text></g>`;
  }).join("");
}

function renderEdges(diagram: PositionedDiagram, prefix: string, motion: string): string {
  const byId = new Map(diagram.nodes.map((node) => [node.id, node]));
  const direction = diagram.layout?.direction ?? "LR";
  return diagram.edges.map((edge, index) => {
    const source = byId.get(edge.from);
    const target = byId.get(edge.to);
    if (!source || !target) return "";
    const variant = edge.variant ?? "default";
    const path = edgePath(edge, source, target, direction);
    const id = safeId(edge.id ?? `${edge.from}-${edge.to}-${index}`);
    const points = edgePoints(source, target, direction);
    const labelX = (points.sx + points.tx) / 2;
    const labelY = (points.sy + points.ty) / 2 - 10;
    const labelWidth = edge.label ? Math.max(52, edge.label.length * 6 + 18) : 0;
    const particles = Math.min(4, Math.max(1, edge.particles ?? 1));
    const animate = edge.animated ?? (motion !== "none" && variant === "accent");
    const particleMarkup = animate ? Array.from({ length: particles }, (_, particleIndex) => `<circle class="vf-particle" r="${particleIndex === 0 ? 3.2 : 2.2}"><animateMotion dur="${2.3 + particleIndex * 0.4}s" begin="-${particleIndex * 0.7}s" repeatCount="indefinite" path="${path}"/></circle>`).join("") : "";
    const label = edge.label ? `<g><rect class="vf-edge-label-bg" x="${labelX - labelWidth / 2}" y="${labelY - 11}" width="${labelWidth}" height="20" rx="10"/><text class="vf-edge-label" x="${labelX}" y="${labelY + 3}" text-anchor="middle">${escapeXml(edge.label)}</text></g>` : "";
    return `<g data-vf-edge="${escapeXml(id)}"><path id="${prefix}-${id}" class="vf-edge ${variant}" d="${path}" marker-end="${variantMarker(prefix, variant)}"/>${particleMarkup}${label}</g>`;
  }).join("");
}

function renderNodes(diagram: PositionedDiagram): string {
  return diagram.nodes.map((node) => {
    const variant = node.variant ?? "default";
    const labels = wrapLabel(node.label, Math.max(12, Math.floor((node.width - 76) / 7)));
    const icon = (node.icon ?? node.label.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)).toUpperCase();
    const textX = node.x + 62;
    const titleY = node.y + (labels.length > 1 ? 30 : 36);
    const description = node.description ? `${node.description.slice(0, Math.max(12, Math.floor((node.width - 76) / 6.1)))}${node.description.length > Math.floor((node.width - 76) / 6.1) ? "…" : ""}` : "";
    const badges = (node.badges ?? []).slice(0, 2).map((badge, index) => {
      const badgeWidth = Math.max(38, badge.length * 5.4 + 14);
      const x = node.x + 14 + index * (badgeWidth + 6);
      const y = node.y + node.height - 24;
      return `<rect class="vf-badge" x="${x}" y="${y}" width="${badgeWidth}" height="15" rx="7.5"/><text class="vf-badge-text" x="${x + badgeWidth / 2}" y="${y + 10.5}" text-anchor="middle">${escapeXml(badge)}</text>`;
    }).join("");
    const title = labels.map((line, index) => `<tspan x="${textX}" dy="${index === 0 ? 0 : 16}">${escapeXml(line)}</tspan>`).join("");
    return `<g data-vf-node="${escapeXml(node.id)}" tabindex="0" role="group" aria-label="${escapeXml(`${node.label}${node.description ? `: ${node.description}` : ""}`)}"><rect class="vf-node-shadow" x="${node.x + 5}" y="${node.y + 8}" width="${node.width}" height="${node.height}" rx="16"/><rect class="vf-node ${variant}" x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="16"/><rect class="vf-node-rail ${variant}" x="${node.x}" y="${node.y + 14}" width="3" height="${node.height - 28}" rx="2"/><rect class="vf-icon-shell" x="${node.x + 14}" y="${node.y + 20}" width="34" height="34" rx="10"/><text class="vf-icon" x="${node.x + 31}" y="${node.y + 41.5}" text-anchor="middle">${escapeXml(icon)}</text><text class="vf-node-label" x="${textX}" y="${titleY}">${title}</text>${description ? `<text class="vf-node-description" x="${textX}" y="${node.y + node.height - 17}">${escapeXml(description)}</text>` : ""}${badges}</g>`;
  }).join("");
}

function renderAnnotations(diagram: PositionedDiagram): string {
  return (diagram.annotations ?? []).map((annotation) => {
    const width = Math.max(130, Math.min(300, annotation.text.length * 6.2 + 24));
    return `<g data-vf-annotation="${escapeXml(annotation.id)}"><rect class="vf-annotation ${escapeXml(annotation.variant ?? "note")}" x="${annotation.x}" y="${annotation.y}" width="${width}" height="38" rx="12"/><text class="vf-annotation-text" x="${annotation.x + 12}" y="${annotation.y + 24}">${escapeXml(annotation.text)}</text></g>`;
  }).join("");
}

export function renderVisualFlow(spec: VisualFlowSpec, options: RenderOptions = {}): RenderResult {
  const diagram = layoutVisualFlow(spec);
  const theme = resolveTheme(options.theme ?? spec.theme);
  const prefix = safeId(options.idPrefix ?? spec.id);
  const motion = options.motion ?? spec.motion ?? "none";
  const markers = (["default", "accent", "success", "warning", "danger", "muted"] as EdgeVariant[]).map((variant) => `<marker id="${prefix}-arrow-${variant}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${markerColor(variant)}"/></marker>`).join("");
  const grid = options.background === false ? "" : `<pattern id="${prefix}-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path class="vf-grid-line" d="M 28 0 L 0 0 0 28" fill="none" opacity=".42"/></pattern>`;
  const description = spec.description ?? `${spec.kind} diagram with ${spec.nodes.length} nodes and ${spec.edges.length} connections`;
  const svg = `<svg class="vf-root ${escapeXml(options.className ?? "")}" data-vf-theme="${theme.name === "porcelain-light" ? "light" : "dark"}" data-vf-diagram="${escapeXml(spec.id)}" xmlns="http://www.w3.org/2000/svg" width="${diagram.width}" height="${diagram.height}" viewBox="0 0 ${diagram.width} ${diagram.height}" role="img" aria-labelledby="${prefix}-title ${prefix}-description" preserveAspectRatio="xMidYMid meet"><title id="${prefix}-title">${escapeXml(spec.title)}</title><desc id="${prefix}-description">${escapeXml(description)}</desc><style>${style(theme)}</style><defs>${markers}${grid}<filter id="vf-glow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect class="vf-bg" x="0" y="0" width="100%" height="100%"/>${options.background === false ? "" : `<rect x="0" y="0" width="100%" height="100%" fill="url(#${prefix}-grid)"/>`}<text class="vf-title" x="36" y="42">${escapeXml(spec.title)}</text><text class="vf-subtitle" x="36" y="63">${escapeXml(spec.kind)} · ${spec.nodes.length} nodes · ${spec.edges.length} connections</text>${renderLanes(diagram)}${renderGroups(diagram)}${renderEdges(diagram, prefix, motion)}${renderNodes(diagram)}${renderAnnotations(diagram)}</svg>`;
  return { svg, width: diagram.width, height: diagram.height, diagram, theme };
}

export { escapeXml };
