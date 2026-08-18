import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  PLATFORM_ID,
  ViewEncapsulation,
  inject,
  type AfterViewInit,
  type OnChanges,
  type OnDestroy,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
  mountVisualFlow,
  type MountOptions,
  type VisualFlowController,
  type VisualFlowSpec,
} from "@lumeflow/core";

@Component({
  selector: "visual-flow-diagram",
  standalone: true,
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "visual-flow-diagram",
    role: "group",
    "[attr.aria-label]": "ariaLabel",
  },
  styles: [
    ".visual-flow-diagram{display:block;min-width:0;min-height:320px;overflow:hidden}",
    ".visual-flow-diagram>svg{display:block;width:100%;height:100%;min-height:inherit}",
  ],
})
export class VisualFlowAngularComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private controller?: VisualFlowController;
  private viewReady = false;

  @Input({ required: true }) public spec?: VisualFlowSpec;
  @Input() public options: MountOptions = { panZoom: true };
  @Output() public readonly visualFlowReady = new EventEmitter<VisualFlowController>();
  @Output() public readonly visualFlowError = new EventEmitter<unknown>();

  public get ariaLabel(): string {
    return this.spec ? `${this.spec.title} diagram` : "LumeFlow diagram";
  }

  public ngAfterViewInit(): void {
    this.viewReady = true;
    this.render();
  }

  public ngOnChanges(): void {
    if (this.viewReady) this.render();
  }

  public ngOnDestroy(): void {
    this.controller?.destroy();
    this.controller = undefined;
  }

  public exportSvg(): string {
    return this.controller?.exportSvg() ?? "";
  }

  private render(): void {
    if (!isPlatformBrowser(this.platformId) || !this.spec) return;
    try {
      if (this.controller) this.controller.update(this.spec, this.options);
      else {
        this.controller = mountVisualFlow(this.host.nativeElement, this.spec, this.options);
        this.visualFlowReady.emit(this.controller);
      }
    } catch (error) {
      this.visualFlowError.emit(error);
    }
  }
}
