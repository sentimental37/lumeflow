import { ChangeDetectionStrategy, Component, ViewChild, computed, signal } from "@angular/core";
import {
  downloadVisualFlow,
  resolveTheme,
  serializeVisualFlow,
  validateVisualFlow,
  type DiagramDirection,
  type EdgeRoute,
  type MotionMode,
  type MountOptions,
  type RasterFormat,
  type VisualFlowSpec,
  type VisualFlowTheme,
} from "@lumeflow/core";
import { VisualFlowAngularComponent } from "@lumeflow/angular";
import { apiPackages, codeSamples, frameworkSupport, schemaGroups } from "./api-reference";
import {
  angularDemos,
  capabilityAtlas,
  layoutFeatureDemos,
  routeGallery,
  variantGallery,
  type AngularDemoKey,
} from "./diagrams";

type BuiltInThemeName = "midnight-current" | "porcelain-light" | "executive-slate";
type SiteTheme = "light" | "dark";
const siteThemeStorageKey = "lumeflow-site-theme";
const legacySiteThemeStorageKey = "visual-flow-site-theme";
type ThemeColorKey =
  | "background"
  | "backgroundAlt"
  | "surface"
  | "surfaceElevated"
  | "border"
  | "borderStrong"
  | "text"
  | "textMuted"
  | "accent"
  | "accentSecondary"
  | "success"
  | "warning"
  | "danger"
  | "grid";
type DownloadFormat = "json" | "svg" | "html" | RasterFormat;

const themePresets: readonly { id: BuiltInThemeName; label: string; description: string; colors: readonly string[] }[] = [
  { id: "midnight-current", label: "Midnight Current", description: "Deep navy with electric teal signals.", colors: ["#071019", "#31e6c0", "#53a9ff"] },
  { id: "porcelain-light", label: "Porcelain Light", description: "Editorial white with confident ink.", colors: ["#f6f9fb", "#087f70", "#216bb3"] },
  { id: "executive-slate", label: "Executive Slate", description: "Boardroom charcoal with warm gold.", colors: ["#11151b", "#d6b66d", "#85aee8"] },
] as const;

const colorTokens: readonly { key: ThemeColorKey; label: string; group: string }[] = [
  { key: "background", label: "Background", group: "Canvas" },
  { key: "backgroundAlt", label: "Background alt", group: "Canvas" },
  { key: "surface", label: "Surface", group: "Surface" },
  { key: "surfaceElevated", label: "Elevated", group: "Surface" },
  { key: "border", label: "Border", group: "Structure" },
  { key: "borderStrong", label: "Border strong", group: "Structure" },
  { key: "text", label: "Text", group: "Type" },
  { key: "textMuted", label: "Text muted", group: "Type" },
  { key: "accent", label: "Accent", group: "Brand" },
  { key: "accentSecondary", label: "Accent secondary", group: "Brand" },
  { key: "success", label: "Success", group: "Semantic" },
  { key: "warning", label: "Warning", group: "Semantic" },
  { key: "danger", label: "Danger", group: "Semantic" },
  { key: "grid", label: "Grid", group: "Canvas" },
] as const;

@Component({
  selector: "app-root",
  standalone: true,
  imports: [VisualFlowAngularComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild("playgroundDiagram", { read: VisualFlowAngularComponent })
  private playgroundDiagram?: VisualFlowAngularComponent;

  protected readonly demos = angularDemos;
  protected readonly layouts = layoutFeatureDemos;
  protected readonly routeGallery = routeGallery;
  protected readonly variantGallery = variantGallery;
  protected readonly capabilityAtlas = capabilityAtlas;
  protected readonly apiPackages = apiPackages;
  protected readonly schemaGroups = schemaGroups;
  protected readonly frameworks = frameworkSupport;
  protected readonly codeSamples = codeSamples;
  protected readonly themePresets = themePresets;
  protected readonly colorTokens = colorTokens;
  protected readonly directions: readonly DiagramDirection[] = ["LR", "TB", "RL", "BT"];
  protected readonly routes: readonly EdgeRoute[] = ["smoothstep", "bezier", "orthogonal", "straight"];
  protected readonly motionModes: readonly MotionMode[] = ["flow", "trace", "none"];
  protected readonly nodeVariants = ["default", "service", "client", "data", "security", "event", "decision", "external"] as const;
  protected readonly edgeVariants = ["default", "accent", "success", "warning", "danger", "muted"] as const;
  protected readonly exportFormats: readonly { id: DownloadFormat; label: string }[] = [
    { id: "svg", label: "SVG" },
    { id: "png", label: "PNG" },
    { id: "jpeg", label: "JPEG" },
    { id: "webp", label: "WebP" },
    { id: "html", label: "HTML" },
    { id: "json", label: "JSON" },
  ];

  protected readonly activeKey = signal<AngularDemoKey>("platform");
  protected readonly siteTheme = signal<SiteTheme>("dark");
  protected readonly ready = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedPreset = signal<BuiltInThemeName>("midnight-current");
  protected readonly customizedTheme = signal(false);
  protected readonly theme = signal<VisualFlowTheme>(resolveTheme("midnight-current"));
  protected readonly direction = signal<DiagramDirection>("LR");
  protected readonly route = signal<EdgeRoute>("smoothstep");
  protected readonly motion = signal<MotionMode>("flow");
  protected readonly showBackground = signal(true);
  protected readonly panZoom = signal(true);
  protected readonly activeApiId = signal("core");
  protected readonly activeSchemaId = signal("spec");
  protected readonly activeCodeId = signal("angular");
  protected readonly copied = signal<string | null>(null);
  protected readonly exportState = signal<string | null>(null);

  protected readonly active = computed(() =>
    this.demos.find((demo) => demo.key === this.activeKey()) ?? this.demos[0],
  );

  protected readonly playgroundSpec = computed<VisualFlowSpec>(() => {
    const base = this.active().spec;
    const motion = this.motion();
    return {
      ...base,
      id: `${base.id}-playground`,
      layout: { ...(base.layout ?? { mode: "dagre" }), direction: this.direction() },
      motion,
      edges: base.edges.map((edge) => ({
        ...edge,
        route: this.route(),
        animated: motion !== "none" && (edge.animated ?? edge.variant === "accent"),
      })),
    };
  });

  protected readonly diagramOptions = computed<MountOptions>(() => ({
    panZoom: this.panZoom(),
    background: this.showBackground(),
    theme: this.theme(),
    motion: this.motion(),
    idPrefix: "angular-api-playground",
  }));

  protected readonly capabilityOptions = computed<MountOptions>(() => ({
    panZoom: true,
    background: true,
    theme: this.theme(),
    motion: "flow",
    idPrefix: "capability-atlas",
  }));

  protected readonly validation = computed(() => validateVisualFlow(this.playgroundSpec()));
  protected readonly activeApi = computed(() => this.apiPackages.find((item) => item.id === this.activeApiId()) ?? this.apiPackages[0]);
  protected readonly activeSchema = computed(() => this.schemaGroups.find((item) => item.id === this.activeSchemaId()) ?? this.schemaGroups[0]);
  protected readonly activeCode = computed(() => this.codeSamples.find((item) => item.id === this.activeCodeId()) ?? this.codeSamples[0]);
  protected readonly apiEntryCount = this.apiPackages.reduce((total, item) => total + item.entries.length, 0);
  protected readonly schemaFieldCount = this.schemaGroups.reduce((total, item) => total + item.fields.length, 0);

  public constructor() {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(siteThemeStorageKey)
      ?? window.localStorage.getItem(legacySiteThemeStorageKey);
    const initial: SiteTheme = saved === "light" || saved === "dark"
      ? saved
      : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    this.siteTheme.set(initial);
    this.applyDocumentTheme(initial);
  }

  protected setSiteTheme(theme: SiteTheme): void {
    this.siteTheme.set(theme);
    if (typeof window !== "undefined") window.localStorage.setItem(siteThemeStorageKey, theme);
    this.applyDocumentTheme(theme);
  }

  protected selectDemo(key: AngularDemoKey): void {
    const next = this.demos.find((demo) => demo.key === key);
    if (!next) return;
    this.error.set(null);
    this.activeKey.set(key);
    this.direction.set(next.spec.layout?.direction ?? "LR");
    this.motion.set(next.spec.motion ?? "none");
  }

  protected applyPreset(name: BuiltInThemeName): void {
    this.selectedPreset.set(name);
    this.customizedTheme.set(false);
    this.theme.set(resolveTheme(name));
  }

  protected resetTheme(): void {
    this.applyPreset(this.selectedPreset());
  }

  protected colorValue(key: ThemeColorKey): string {
    return this.theme()[key];
  }

  protected updateColor(key: ThemeColorKey, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.theme.update((current) => ({ ...current, name: "custom-studio", [key]: value }));
    this.customizedTheme.set(true);
  }

  protected updateShadow(event: Event): void {
    const shadow = (event.target as HTMLInputElement).value;
    this.theme.update((current) => ({ ...current, name: "custom-studio", shadow }));
    this.customizedTheme.set(true);
  }

  protected updateFont(key: "fontFamily" | "monoFontFamily", event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.theme.update((current) => ({ ...current, name: "custom-studio", [key]: value }));
    this.customizedTheme.set(true);
  }

  protected updateRadius(event: Event): void {
    const radius = Number((event.target as HTMLInputElement).value);
    this.theme.update((current) => ({ ...current, name: "custom-studio", radius }));
    this.customizedTheme.set(true);
  }

  protected setDirection(direction: DiagramDirection): void { this.direction.set(direction); }
  protected setRoute(route: EdgeRoute): void { this.route.set(route); }
  protected setMotion(motion: MotionMode): void { this.motion.set(motion); }
  protected toggleBackground(): void { this.showBackground.update((value) => !value); }
  protected togglePanZoom(): void { this.panZoom.update((value) => !value); }
  protected setApi(id: string): void { this.activeApiId.set(id); }
  protected setSchema(id: string): void { this.activeSchemaId.set(id); }
  protected setCode(id: string): void { this.activeCodeId.set(id); }
  protected markReady(): void { this.ready.set(true); }

  protected reportError(error: unknown): void {
    this.error.set(error instanceof Error ? error.message : "Unable to render this diagram.");
  }

  protected async exportDiagram(format: DownloadFormat): Promise<void> {
    try {
      this.exportState.set(`Preparing ${format.toUpperCase()}…`);
      await downloadVisualFlow(this.playgroundSpec(), format, this.diagramOptions());
      this.exportState.set(`${format.toUpperCase()} downloaded`);
    } catch (error) {
      this.exportState.set(error instanceof Error ? error.message : `Unable to export ${format}.`);
    }
    window.setTimeout(() => this.exportState.set(null), 2200);
  }

  protected async copySpec(): Promise<void> {
    await this.copyText(serializeVisualFlow(this.playgroundSpec()), "spec");
  }

  protected async copyActiveCode(): Promise<void> {
    await this.copyText(this.activeCode().code, `code-${this.activeCode().id}`);
  }

  protected async copyInstall(): Promise<void> {
    await this.copyText(this.activeApi().install, `install-${this.activeApi().id}`);
  }

  protected exportCurrentSvg(): void {
    const svg = this.playgroundDiagram?.exportSvg();
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${this.playgroundSpec().id}.svg`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  private async copyText(value: string, key: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.copied.set(key);
      window.setTimeout(() => this.copied.set(null), 1800);
    } catch {
      this.copied.set(null);
    }
  }

  private applyDocumentTheme(theme: SiteTheme): void {
    if (typeof document === "undefined") return;
    document.documentElement.dataset["siteTheme"] = theme;
    document.documentElement.style.colorScheme = theme;
  }
}
