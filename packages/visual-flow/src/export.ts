import { renderVisualFlow } from "./render.js";
import type { RasterFormat, RenderOptions, VisualFlowSpec } from "./types.js";

function htmlEscape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function serializeVisualFlow(spec: VisualFlowSpec, space = 2): string {
  return `${JSON.stringify(spec, null, space)}\n`;
}

export function renderStandaloneHtml(spec: VisualFlowSpec, options: RenderOptions = {}): string {
  const result = renderVisualFlow(spec, { ...options, interactive: true });
  const title = htmlEscape(spec.title);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · LumeFlow</title>
<style>:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#050b11;color:#effaff;font-family:Inter,system-ui,sans-serif}.vf-shell{min-height:100vh;padding:20px}.vf-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:1600px;margin:0 auto 12px}.vf-brand{font-weight:760;letter-spacing:-.02em}.vf-brand small{display:block;color:#829ba7;font:600 10px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;margin-top:4px}.vf-actions{display:flex;gap:8px;flex-wrap:wrap}.vf-actions button{border:1px solid #294251;background:#0e1b25;color:#eaf8fb;border-radius:10px;padding:8px 11px;font:650 11px ui-monospace,monospace;cursor:pointer}.vf-actions button:hover{border-color:#31e6c0;color:#31e6c0}.vf-stage{max-width:1600px;margin:auto;border:1px solid #1c3443;border-radius:18px;overflow:hidden;background:#071019;box-shadow:0 26px 70px rgba(0,0,0,.38)}.vf-stage svg{display:block;width:100%;height:auto;max-height:calc(100vh - 110px)}@media(max-width:680px){.vf-shell{padding:10px}.vf-toolbar{align-items:flex-start}.vf-actions{justify-content:flex-end}}</style></head>
<body><main class="vf-shell"><div class="vf-toolbar"><div class="vf-brand">${title}<small>LumeFlow · interactive artifact</small></div><div class="vf-actions"><button id="theme" type="button">Toggle theme</button><button data-export="svg" type="button">SVG</button><button data-export="png" type="button">PNG</button><button data-export="webp" type="button">WebP</button></div></div><div class="vf-stage">${result.svg}</div></main>
<script>const svg=document.querySelector('.vf-root');const key='visual-flow-theme';const saved=localStorage.getItem(key);if(saved)svg.dataset.vfTheme=saved;document.querySelector('#theme').addEventListener('click',()=>{const next=svg.dataset.vfTheme==='light'?'dark':'light';svg.dataset.vfTheme=next;localStorage.setItem(key,next)});function save(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}function svgBlob(){return new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml;charset=utf-8'})}async function raster(format){const url=URL.createObjectURL(svgBlob());const img=new Image();await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});const box=svg.viewBox.baseVal;const scale=Math.min(3,2400/Math.max(box.width,box.height));const canvas=document.createElement('canvas');canvas.width=Math.ceil(box.width*scale);canvas.height=Math.ceil(box.height*scale);const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);const mime=format==='png'?'image/png':'image/webp';canvas.toBlob(blob=>blob&&save(blob,'${htmlEscape(spec.id)}.'+format),mime,.94)}document.querySelectorAll('[data-export]').forEach(button=>button.addEventListener('click',()=>{const format=button.dataset.export;if(format==='svg')save(svgBlob(),'${htmlEscape(spec.id)}.svg');else raster(format)}));</script></body></html>`;
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function downloadText(content: string, filename: string, type = "text/plain;charset=utf-8"): void {
  saveBlob(new Blob([content], { type }), filename);
}

export async function renderRasterBlob(spec: VisualFlowSpec, format: RasterFormat = "png", options: RenderOptions & { scale?: number; quality?: number } = {}): Promise<Blob> {
  if (typeof document === "undefined") throw new Error("Raster export requires a browser DOM.");
  const { svg, width, height } = renderVisualFlow(spec, options);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to rasterize the generated SVG."));
      image.src = url;
    });
    const scale = Math.max(0.5, Math.min(4, options.scale ?? 2));
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is unavailable.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const mime = format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error(`Unable to encode ${format}.`)), mime, options.quality ?? 0.94));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function downloadVisualFlow(spec: VisualFlowSpec, format: "json" | "svg" | "html" | RasterFormat, options: RenderOptions = {}): Promise<void> {
  if (format === "json") return downloadText(serializeVisualFlow(spec), `${spec.id}.visual-flow.json`, "application/json;charset=utf-8");
  if (format === "svg") return downloadText(renderVisualFlow(spec, options).svg, `${spec.id}.svg`, "image/svg+xml;charset=utf-8");
  if (format === "html") return downloadText(renderStandaloneHtml(spec, options), `${spec.id}.html`, "text/html;charset=utf-8");
  saveBlob(await renderRasterBlob(spec, format, options), `${spec.id}.${format === "jpeg" ? "jpg" : format}`);
}
