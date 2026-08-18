import { useEffect, useMemo, useState } from "react";
import { downloadVisualFlow, freezeVisualFlowLayout, resolveTheme, serializeVisualFlow, validateVisualFlow, visualFlowThemes, type DiagramKind, type DiagramNode, type VisualFlowSpec, type VisualFlowTheme } from "@lumeflow/core";
import { VisualFlow } from "@lumeflow/react";
import { cloneTemplate, palette, templates } from "./templates.js";

type InspectorTab = "properties" | "theme" | "json";
const storageKey = "lumeflow-studio-v1";
const legacyStorageKey = "visual-flow-kit-studio-v1";

function loadInitial(): VisualFlowSpec {
  try {
    const saved = localStorage.getItem(storageKey) ?? localStorage.getItem(legacyStorageKey);
    if (saved) {
      const parsed = JSON.parse(saved) as VisualFlowSpec;
      if (validateVisualFlow(parsed).valid) return parsed;
    }
  } catch {
    // A corrupt local draft should never prevent the Studio from opening.
  }
  return cloneTemplate("platform");
}

function formatLabel(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Icon({ name }: { name: "flow" | "nodes" | "theme" | "code" | "download" | "layout" }) {
  const paths = {
    flow: "M4 6h5v5H4zM15 13h5v5h-5zM9 8.5h3a3 3 0 0 1 3 3V13M12 4l3-2 3 2-3 2z",
    nodes: "M4 4h6v6H4zM14 14h6v6h-6zM10 7h2a5 5 0 0 1 5 5v2",
    theme: "M12 3a9 9 0 1 0 9 9c0-1.1-.9-2-2-2h-3a2 2 0 0 1-2-2V5c0-1.1-.9-2-2-2zM7 12h.01M9 7h.01M15 17h.01",
    code: "m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
    download: "M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3",
    layout: "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  };
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function PaletteItem({ node, onAdd }: { node: (typeof palette)[number]; onAdd: () => void }) {
  const startDrag = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/visual-flow-node", JSON.stringify(node));
    event.dataTransfer.effectAllowed = "copy";
  };
  return (
    <button className={`palette-item palette-item--${node.variant}`} draggable onDragStart={startDrag} onClick={onAdd} type="button" title="Drag onto the canvas or click to add">
      <span className="palette-item__icon">{node.icon}</span>
      <span><strong>{node.label}</strong><small>{node.description}</small></span>
      <span className="drag-dots" aria-hidden="true">⠿</span>
    </button>
  );
}

function Field({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export function App() {
  const [spec, setSpec] = useState<VisualFlowSpec>(loadInitial);
  const [selectedId, setSelectedId] = useState<string>();
  const [tab, setTab] = useState<InspectorTab>("properties");
  const [jsonDraft, setJsonDraft] = useState(() => serializeVisualFlow(spec));
  const [jsonDirty, setJsonDirty] = useState(false);
  const [notice, setNotice] = useState("Ready");
  const selected = useMemo(() => spec.nodes.find((node) => node.id === selectedId), [selectedId, spec.nodes]);
  const theme = resolveTheme(spec.theme);
  const validation = useMemo(() => validateVisualFlow(spec), [spec]);

  useEffect(() => {
    localStorage.setItem(storageKey, serializeVisualFlow(spec));
    if (!jsonDirty) setJsonDraft(serializeVisualFlow(spec));
  }, [jsonDirty, spec]);

  const updateNode = (patch: Partial<DiagramNode>) => {
    if (!selectedId) return;
    setSpec((current) => ({ ...current, nodes: current.nodes.map((node) => node.id === selectedId ? { ...node, ...patch } : node) }));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setSpec((current) => ({ ...current, nodes: current.nodes.filter((node) => node.id !== selectedId), edges: current.edges.filter((edge) => edge.from !== selectedId && edge.to !== selectedId), groups: current.groups?.map((group) => ({ ...group, nodeIds: group.nodeIds.filter((id) => id !== selectedId) })).filter((group) => group.nodeIds.length) }));
    setSelectedId(undefined);
    setNotice("Node removed");
  };

  const addNode = (node: Pick<DiagramNode, "variant" | "label" | "description" | "icon">, position?: { x: number; y: number }) => {
    const id = `${node.variant}-${crypto.randomUUID().slice(0, 8)}`;
    setSpec((current) => {
      const existingNodes = current.layout?.mode === "manual" ? current.nodes : freezeVisualFlowLayout(current).nodes;
      const nextPosition = position ?? {
        x: 120 + (current.nodes.length % 3) * 190,
        y: 140 + (Math.floor(current.nodes.length / 3) % 3) * 145,
      };
      return { ...current, layout: { ...current.layout, mode: "manual" }, nodes: [...existingNodes, { ...node, id, x: nextPosition.x, y: nextPosition.y }] };
    });
    setSelectedId(id);
    setTab("properties");
    setNotice(`${node.label} added`);
  };

  const dropped = (position: { x: number; y: number }, dataTransfer: DataTransfer) => {
    const value = dataTransfer.getData("application/visual-flow-node");
    if (!value) return;
    addNode(JSON.parse(value) as (typeof palette)[number], position);
  };

  const useTemplate = (name: keyof typeof templates) => {
    const next = cloneTemplate(name);
    setSpec(next);
    setSelectedId(undefined);
    setJsonDirty(false);
    setJsonDraft(serializeVisualFlow(next));
    setNotice(`${formatLabel(name)} template loaded`);
  };

  const autoLayout = () => {
    setSpec((current) => ({ ...current, layout: { ...current.layout, mode: "dagre", direction: current.layout?.direction ?? "LR" }, nodes: current.nodes.map(({ x: _x, y: _y, ...node }) => node) }));
    setNotice("Automatic layout applied");
  };

  const updateTheme = <K extends keyof VisualFlowTheme>(key: K, value: VisualFlowTheme[K]) => {
    setSpec((current) => ({ ...current, theme: { ...resolveTheme(current.theme), name: "custom", [key]: value } }));
  };

  const applyJson = () => {
    try {
      const next = JSON.parse(jsonDraft) as VisualFlowSpec;
      const result = validateVisualFlow(next);
      if (!result.valid) throw new Error(result.issues.filter((item) => item.severity === "error")[0]?.message ?? "Invalid diagram");
      setSpec(next);
      setJsonDirty(false);
      setNotice("JSON applied");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to parse JSON");
    }
  };

  const exportFile = async (format: "json" | "svg" | "html" | "png" | "webp") => {
    try {
      await downloadVisualFlow(spec, format);
      setNotice(`${format.toUpperCase()} exported`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Export failed");
    }
  };

  return (
    <main className={`studio${theme.name === "porcelain-light" ? " studio--light" : ""}`} style={{ "--studio-accent": theme.accent, "--studio-background": theme.background, "--studio-surface": theme.surface, "--studio-text": theme.text, "--studio-muted": theme.textMuted, "--studio-border": theme.border } as React.CSSProperties}>
      <header className="topbar">
        <a className="brand" href="../" aria-label="Back to the LumeFlow showcase"><span className="brand__mark"><Icon name="flow" /></span><span><strong>LumeFlow</strong><small>Studio</small></span></a>
        <div className="document-title">
          <span className={`status-dot${validation.valid ? " is-valid" : ""}`} />
          <input aria-label="Diagram title" value={spec.title} onChange={(event) => setSpec((current) => ({ ...current, title: event.target.value }))} />
          <small>{validation.valid ? "Saved locally" : `${validation.issues.length} model issues`}</small>
        </div>
        <nav className="topbar__actions" aria-label="Diagram actions">
          <a className="docs-button" href="../#builder">Showcase</a>
          <button type="button" onClick={autoLayout}><Icon name="layout" />Auto layout</button>
          <span className="export-menu">
            <button type="button"><Icon name="download" />Export</button>
            <span className="export-menu__items">{(["json", "svg", "html", "png", "webp"] as const).map((format) => <button key={format} type="button" onClick={() => void exportFile(format)}>{format.toUpperCase()}</button>)}</span>
          </span>
        </nav>
      </header>

      <aside className="palette-panel">
        <div className="panel-heading"><span><Icon name="nodes" /></span><div><strong>Components</strong><small>Drag onto canvas</small></div></div>
        <div className="template-picker">
          <span>Start from</span>
          <div>{(Object.keys(templates) as Array<keyof typeof templates>).map((name) => <button className={spec.id === templates[name].id ? "is-active" : ""} key={name} type="button" onClick={() => useTemplate(name)}>{formatLabel(name)}</button>)}</div>
        </div>
        <div className="palette-list">{palette.map((node) => <PaletteItem key={node.variant} node={node} onAdd={() => addNode(node)} />)}</div>
        <div className="palette-tip"><span>Tip</span><p>Drag between glowing handles to connect components. Select a node to edit it.</p></div>
      </aside>

      <section className="canvas-panel">
        <div className="canvas-meta"><span>{formatLabel(spec.kind)}</span><span>{spec.nodes.length} components</span><span>{spec.edges.length} connections</span></div>
        <VisualFlow spec={spec} editable onSpecChange={setSpec} onSelectionChange={setSelectedId} onCanvasDrop={dropped} theme={spec.theme} />
        {spec.nodes.length === 0 ? <div className="empty-state"><span><Icon name="nodes" /></span><strong>Build your first flow</strong><p>Drag a component here or start from a polished template.</p><button type="button" onClick={() => addNode(palette[0], { x: 180, y: 190 })}>Add first component</button></div> : null}
        <div className="notice" role="status">{notice}</div>
      </section>

      <aside className="inspector-panel">
        <div className="inspector-tabs" role="tablist">
          <button className={tab === "properties" ? "is-active" : ""} type="button" onClick={() => setTab("properties")}><Icon name="nodes" /><span>Properties</span></button>
          <button className={tab === "theme" ? "is-active" : ""} type="button" onClick={() => setTab("theme")}><Icon name="theme" /><span>Theme</span></button>
          <button className={tab === "json" ? "is-active" : ""} type="button" onClick={() => setTab("json")}><Icon name="code" /><span>JSON</span></button>
        </div>

        {tab === "properties" ? <div className="inspector-content">
          <div className="panel-heading compact"><span><Icon name="nodes" /></span><div><strong>{selected ? "Selected component" : "Diagram"}</strong><small>{selected?.id ?? "Nothing selected"}</small></div></div>
          {selected ? <>
            <Field label="Label"><input value={selected.label} onChange={(event) => updateNode({ label: event.target.value })} /></Field>
            <Field label="Description"><textarea rows={3} value={selected.description ?? ""} onChange={(event) => updateNode({ description: event.target.value })} /></Field>
            <div className="field-row"><Field label="Icon"><input maxLength={2} value={selected.icon ?? ""} onChange={(event) => updateNode({ icon: event.target.value.toUpperCase() })} /></Field><Field label="Type"><select value={selected.variant ?? "default"} onChange={(event) => updateNode({ variant: event.target.value as DiagramNode["variant"] })}>{["default", "client", "service", "data", "security", "event", "decision", "external"].map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select></Field></div>
            <Field label="Badges"><input value={selected.badges?.join(", ") ?? ""} placeholder="OIDC, FDC3" onChange={(event) => updateNode({ badges: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></Field>
            <button className="danger-button" type="button" onClick={deleteSelected}>Delete component</button>
          </> : <>
            <Field label="Description"><textarea rows={4} value={spec.description ?? ""} onChange={(event) => setSpec((current) => ({ ...current, description: event.target.value }))} /></Field>
            <Field label="Diagram type"><select value={spec.kind} onChange={(event) => setSpec((current) => ({ ...current, kind: event.target.value as DiagramKind }))}>{["architecture", "workflow", "dataflow", "sequence", "lifecycle"].map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select></Field>
            <Field label="Motion"><select value={spec.motion ?? "none"} onChange={(event) => setSpec((current) => ({ ...current, motion: event.target.value as VisualFlowSpec["motion"] }))}><option value="none">Static</option><option value="trace">Trace</option><option value="flow">Flow particles</option></select></Field>
          </>}
        </div> : null}

        {tab === "theme" ? <div className="inspector-content">
          <div className="panel-heading compact"><span><Icon name="theme" /></span><div><strong>Theme workbench</strong><small>Live design tokens</small></div></div>
          <div className="theme-cards">{Object.keys(visualFlowThemes).map((name) => {
            const optionTheme = visualFlowThemes[name as keyof typeof visualFlowThemes];
            return <button className={theme.name === name ? "is-active" : ""} key={name} type="button" onClick={() => setSpec((current) => ({ ...current, theme: name }))}><span style={{ background: optionTheme.background }}><i style={{ background: optionTheme.accent }} /></span><strong>{formatLabel(name)}</strong></button>;
          })}</div>
          <div className="color-grid">{(["accent", "accentSecondary", "background", "surface", "text", "textMuted"] as const).map((key) => <Field key={key} label={formatLabel(key)}><span className="color-input"><input type="color" value={theme[key]} onChange={(event) => updateTheme(key, event.target.value)} /><code>{theme[key]}</code></span></Field>)}</div>
          <Field label="Corner radius"><input type="range" min="4" max="28" value={theme.radius} onChange={(event) => updateTheme("radius", Number(event.target.value))} /><small>{theme.radius}px</small></Field>
        </div> : null}

        {tab === "json" ? <div className="inspector-content json-panel">
          <div className="panel-heading compact"><span><Icon name="code" /></span><div><strong>Portable source</strong><small>Schema version {spec.schemaVersion}</small></div></div>
          <textarea aria-label="LumeFlow JSON" spellCheck={false} value={jsonDraft} onChange={(event) => { setJsonDraft(event.target.value); setJsonDirty(true); }} />
          <div className="json-actions"><button type="button" onClick={() => { setJsonDraft(serializeVisualFlow(spec)); setJsonDirty(false); }}>Reset</button><button className="primary-button" type="button" onClick={applyJson}>Validate & apply</button></div>
          <p className={`validation-message${validation.valid ? " is-valid" : ""}`}>{validation.valid ? "Valid LumeFlow v1 source" : validation.issues[0]?.message}</p>
        </div> : null}
      </aside>
    </main>
  );
}
