import type { VisualFlowTheme } from "./types.js";

export const midnightCurrent: VisualFlowTheme = {
  name: "midnight-current",
  background: "#071019",
  backgroundAlt: "#0a1622",
  surface: "#0d1b28",
  surfaceElevated: "#112536",
  border: "#234153",
  borderStrong: "#3a6477",
  text: "#effaff",
  textMuted: "#8facb9",
  accent: "#31e6c0",
  accentSecondary: "#53a9ff",
  success: "#68e59f",
  warning: "#f2c96d",
  danger: "#ff7890",
  grid: "#163141",
  shadow: "rgba(0, 0, 0, 0.42)",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  monoFontFamily: "'JetBrains Mono', 'Cascadia Code', ui-monospace, monospace",
  radius: 16,
};

export const porcelainLight: VisualFlowTheme = {
  name: "porcelain-light",
  background: "#f6f9fb",
  backgroundAlt: "#edf3f6",
  surface: "#ffffff",
  surfaceElevated: "#f9fcfd",
  border: "#c8d7de",
  borderStrong: "#8ea8b4",
  text: "#10252f",
  textMuted: "#5c747f",
  accent: "#087f70",
  accentSecondary: "#216bb3",
  success: "#168752",
  warning: "#9a6812",
  danger: "#b93651",
  grid: "#dce7eb",
  shadow: "rgba(23, 54, 67, 0.16)",
  fontFamily: midnightCurrent.fontFamily,
  monoFontFamily: midnightCurrent.monoFontFamily,
  radius: 16,
};

export const executiveSlate: VisualFlowTheme = {
  ...midnightCurrent,
  name: "executive-slate",
  background: "#11151b",
  backgroundAlt: "#171d25",
  surface: "#1a212b",
  surfaceElevated: "#222c38",
  border: "#364351",
  borderStrong: "#586b7d",
  accent: "#d6b66d",
  accentSecondary: "#85aee8",
  grid: "#252f3a",
};

export const visualFlowThemes = {
  "midnight-current": midnightCurrent,
  "porcelain-light": porcelainLight,
  "executive-slate": executiveSlate,
} as const;

export function resolveTheme(input?: string | Partial<VisualFlowTheme>): VisualFlowTheme {
  if (!input) return { ...midnightCurrent };
  if (typeof input === "string") return { ...(visualFlowThemes[input as keyof typeof visualFlowThemes] ?? midnightCurrent) };
  const base = input.name ? visualFlowThemes[input.name as keyof typeof visualFlowThemes] ?? midnightCurrent : midnightCurrent;
  return { ...base, ...input };
}
