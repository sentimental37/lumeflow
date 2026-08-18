import { ChangeDetectionStrategy, Component, ViewChild, computed, signal } from "@angular/core";
import { VisualFlowAngularComponent } from "@sentimental37/visual-flow-angular";
import { angularDemos, type AngularDemoKey } from "./diagrams";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [VisualFlowAngularComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild(VisualFlowAngularComponent) private diagram?: VisualFlowAngularComponent;

  protected readonly demos = angularDemos;
  protected readonly activeKey = signal<AngularDemoKey>("platform");
  protected readonly ready = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly active = computed(() =>
    this.demos.find((demo) => demo.key === this.activeKey()) ?? this.demos[0],
  );
  protected readonly diagramOptions = { panZoom: true } as const;

  protected select(key: AngularDemoKey): void {
    this.error.set(null);
    this.activeKey.set(key);
  }

  protected markReady(): void {
    this.ready.set(true);
  }

  protected reportError(error: unknown): void {
    this.error.set(error instanceof Error ? error.message : "Unable to render this diagram.");
  }

  protected exportSvg(): void {
    const svg = this.diagram?.exportSvg();
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${this.active().spec.id}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
