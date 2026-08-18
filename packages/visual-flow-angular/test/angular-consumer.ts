import { Component } from "@angular/core";
import { VisualFlowAngularComponent } from "@sentimental37/visual-flow-angular";
import type { VisualFlowSpec } from "@sentimental37/visual-flow";

@Component({
  selector: "test-consumer",
  standalone: true,
  imports: [VisualFlowAngularComponent],
  template: '<visual-flow-diagram [spec]="spec" [options]="{ panZoom: false }" />',
})
export class AngularConsumerComponent {
  public readonly spec: VisualFlowSpec = {
    schemaVersion: 1,
    id: "angular-consumer",
    kind: "workflow",
    title: "Angular consumer",
    nodes: [{ id: "app", label: "Angular application" }],
    edges: [],
  };
}
