# `@lumeflow/angular`

Standalone Angular component for portable `@lumeflow/core` diagrams. The package is published in Angular Package Format with partial-Ivy metadata, supports Angular 17 through 22, and guards browser-only rendering so server-side rendering can import it safely.

```powershell
npm install @lumeflow/core @lumeflow/angular
```

Import the standalone component directly:

```ts
import { Component } from "@angular/core";
import { VisualFlowAngularComponent } from "@lumeflow/angular";

@Component({
  standalone: true,
  imports: [VisualFlowAngularComponent],
  template: `
    <visual-flow-diagram
      [spec]="diagram"
      [options]="{ panZoom: true }"
      (visualFlowError)="reportError($event)"
    />
  `,
})
export class ArchitecturePage {
  diagram = architectureSpec;
  reportError(error: unknown) { console.error(error); }
}
```

The host element fills its container and has a 320px minimum height. Set a containing height when embedding it in dashboards. Call `exportSvg()` through `@ViewChild(VisualFlowAngularComponent)` when a user needs the current SVG.

The adapter owns only Angular lifecycle and SSR integration. Diagram validation, layout, rendering, themes, motion, and export remain in the framework-neutral core package.
