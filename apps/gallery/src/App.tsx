import { useState } from "react";
import { VisualFlow } from "@sentimental37/visual-flow-react";
import { demos, type DemoKey } from "./diagrams.js";

const demoKeys = Object.keys(demos) as DemoKey[];

function Mark() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 8h8v8H5zM19 16h8v8h-8z" /><path d="M13 12h3a5 5 0 0 1 5 5" /><path d="m18 5 4 3-4 3" /></svg>;
}

export function App() {
  const [activeKey, setActiveKey] = useState<DemoKey>("commerce");
  const active = demos[activeKey];

  return (
    <main className="gallery-shell">
      <header className="nav">
        <a className="wordmark" href="#top"><span><Mark /></span><strong>Visual Flow <i>Kit</i></strong></a>
        <nav aria-label="Primary navigation"><a href="#gallery">Gallery</a><a href="#frameworks">Frameworks</a><a href="https://github.com/sentimental37/visual-flow-kit">GitHub</a></nav>
        <a className="builder-link" href="http://127.0.0.1:4317">Open builder <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div>
          <span className="kicker"><i /> Source-controlled visual systems</span>
          <h1>Architecture you can <em>feel.</em></h1>
          <p>Build sleek, interactive diagrams from portable JSON—then render them anywhere on the web.</p>
        </div>
        <div className="hero-meta">
          <span><strong>SVG</strong><small>crisp at every scale</small></span>
          <span><strong>JSON</strong><small>diffable source</small></span>
          <span><strong>0 lock-in</strong><small>framework neutral</small></span>
        </div>
      </section>

      <section className="showcase" id="gallery">
        <aside className="demo-menu">
          <div className="demo-menu__heading"><small>Live collection</small><strong>Choose a system</strong></div>
          {demoKeys.map((key, index) => {
            const demo = demos[key];
            return <button className={activeKey === key ? "is-active" : ""} key={key} type="button" onClick={() => setActiveKey(key)}>
              <span>0{index + 1}</span><div><small>{demo.eyebrow}</small><strong>{demo.spec.title}</strong><p>{demo.summary}</p></div><i>→</i>
            </button>;
          })}
          <div className="portable-note"><span>⌘</span><div><strong>One portable model</strong><p>The same source powers static SVG, React canvases, Angular components, and agent-generated docs.</p></div></div>
        </aside>

        <article className={`diagram-card diagram-card--${active.spec.theme}`}>
          <header><div><span>{active.eyebrow}</span><h2>{active.spec.title}</h2></div><div className="live-pill"><i /> live diagram</div></header>
          <div className="diagram-stage"><VisualFlow key={activeKey} spec={active.spec} showControls showMiniMap={false} style={{ width: "100%", height: "100%" }} /></div>
          <footer><span>{active.stat}</span><code>{active.spec.id}.visual-flow.json</code><span className="hint">pan · zoom · explore</span></footer>
        </article>
      </section>

      <section className="framework-strip" id="frameworks">
        <span>Render everywhere</span>
        <div>{["Vanilla JS", "React", "Next.js", "Angular", "Vue", "Svelte", "Astro", "Web Components"].map((name) => <i key={name}>{name}</i>)}</div>
      </section>
    </main>
  );
}
