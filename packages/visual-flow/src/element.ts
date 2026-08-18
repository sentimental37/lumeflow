import { mountVisualFlow } from "./dom.js";
import type { VisualFlowController, VisualFlowSpec } from "./types.js";

const HTMLElementBase = (globalThis as { HTMLElement?: typeof HTMLElement }).HTMLElement
  ?? (class {} as typeof HTMLElement);

export class VisualFlowElement extends HTMLElementBase {
  #controller?: VisualFlowController;
  #spec?: VisualFlowSpec;

  static get observedAttributes(): string[] {
    return ["pan-zoom"];
  }

  set spec(value: VisualFlowSpec | undefined) {
    this.#spec = value;
    this.#render();
  }

  get spec(): VisualFlowSpec | undefined {
    return this.#spec;
  }

  connectedCallback(): void {
    try {
      if (!this.#spec) {
        const script = this.querySelector<HTMLScriptElement>('script[type="application/json"]');
        if (script?.textContent) this.#spec = JSON.parse(script.textContent) as VisualFlowSpec;
      }
      this.#render();
    } catch (error) {
      this.dispatchEvent(new CustomEvent("visual-flow-error", { detail: error }));
    }
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = undefined;
  }

  exportSvg(): string {
    return this.#controller?.exportSvg() ?? "";
  }

  #render(): void {
    if (!this.isConnected || !this.#spec) return;
    if (this.#controller) this.#controller.update(this.#spec, { panZoom: this.getAttribute("pan-zoom") !== "false" });
    else {
      this.#controller = mountVisualFlow(this, this.#spec, { panZoom: this.getAttribute("pan-zoom") !== "false" });
      this.dispatchEvent(new CustomEvent("visual-flow-ready", { detail: this.#controller }));
    }
  }
}

export function defineVisualFlowElement(tagName = "visual-flow"): typeof VisualFlowElement {
  if (typeof customElements === "undefined") {
    throw new Error("Visual Flow custom elements can only be registered in a browser environment.");
  }
  if (!customElements.get(tagName)) customElements.define(tagName, VisualFlowElement);
  return VisualFlowElement;
}

export { mountVisualFlow } from "./dom.js";
export type { VisualFlowSpec } from "./types.js";
