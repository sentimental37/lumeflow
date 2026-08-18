import { renderVisualFlow } from "./render.js";
import type { MountOptions, VisualFlowController, VisualFlowSpec } from "./types.js";

export function mountVisualFlow(container: Element, initialSpec: VisualFlowSpec, initialOptions: MountOptions = {}): VisualFlowController {
  let spec = initialSpec;
  let options = initialOptions;
  let svg = "";
  const abort = new AbortController();

  const render = () => {
    const result = renderVisualFlow(spec, options);
    svg = result.svg;
    container.innerHTML = svg;
    const element = container.querySelector<SVGSVGElement>("svg");
    if (!element || options.panZoom === false) return;
    const base = element.viewBox.baseVal;
    let view = { x: base.x, y: base.y, width: base.width, height: base.height };
    let pointer: { x: number; y: number } | undefined;
    const apply = () => element.setAttribute("viewBox", `${view.x} ${view.y} ${view.width} ${view.height}`);
    element.addEventListener("wheel", (event) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 1.08 : 0.92;
      const nextWidth = Math.max(base.width * 0.35, Math.min(base.width * 3, view.width * factor));
      const nextHeight = nextWidth * (base.height / base.width);
      view = { x: view.x + (view.width - nextWidth) / 2, y: view.y + (view.height - nextHeight) / 2, width: nextWidth, height: nextHeight };
      apply();
    }, { passive: false, signal: abort.signal });
    element.addEventListener("pointerdown", (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      element.setPointerCapture(event.pointerId);
    }, { signal: abort.signal });
    element.addEventListener("pointermove", (event) => {
      if (!pointer) return;
      const scale = view.width / element.clientWidth;
      view.x -= (event.clientX - pointer.x) * scale;
      view.y -= (event.clientY - pointer.y) * scale;
      pointer = { x: event.clientX, y: event.clientY };
      apply();
    }, { signal: abort.signal });
    element.addEventListener("pointerup", () => { pointer = undefined; }, { signal: abort.signal });
  };

  render();
  return {
    update(nextSpec, nextOptions = options) {
      spec = nextSpec;
      options = nextOptions;
      render();
    },
    exportSvg: () => svg,
    destroy() {
      abort.abort();
      container.innerHTML = "";
    },
  };
}
