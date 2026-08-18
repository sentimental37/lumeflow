import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { layoutVisualFlow, renderStandaloneHtml, renderVisualFlow, serializeVisualFlow, validateVisualFlow, VISUAL_FLOW_SCHEMA, type VisualFlowSpec } from "@lumeflow/core";
import { migrateMermaid } from "./migrate.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function usage(): never {
  console.log(`LumeFlow CLI

Usage:
  lumeflow validate <diagram.visual-flow.json>
  lumeflow render <diagram.visual-flow.json> --format svg|html|json --output <file>
  lumeflow inspect <diagram.visual-flow.json>
  lumeflow migrate-mermaid <diagram.mmd> --title "Title" --output <diagram.visual-flow.json>
  lumeflow schema [--output visual-flow.schema.json]

All commands exit non-zero on invalid input.`);
  process.exit(1);
}

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1];
  return args.find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1);
}

async function readSpec(path: string): Promise<VisualFlowSpec> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as VisualFlowSpec;
}

function defaultOutput(input: string, format: string): string {
  const extension = extname(input);
  const stem = basename(input, extension).replace(/\.visual-flow$/, "");
  return join(dirname(resolve(input)), `${stem}.${format}`);
}

async function validate(input: string): Promise<void> {
  const result = validateVisualFlow(await readSpec(input));
  for (const entry of result.issues) console.log(`${entry.severity.toUpperCase()} ${entry.path} [${entry.code}] ${entry.message}`);
  if (!result.valid) throw new Error(`Validation failed with ${result.issues.filter((entry) => entry.severity === "error").length} error(s).`);
  console.log(`PASS ${input}: valid LumeFlow diagram${result.issues.length ? ` with ${result.issues.length} warning(s)` : ""}.`);
}

async function render(input: string, args: string[]): Promise<void> {
  const spec = await readSpec(input);
  const result = validateVisualFlow(spec);
  if (!result.valid) throw new Error(result.issues.filter((entry) => entry.severity === "error").map((entry) => `${entry.path}: ${entry.message}`).join("\n"));
  const format = option(args, "--format") ?? "svg";
  if (!new Set(["svg", "html", "json"]).has(format)) throw new Error(`Unsupported format '${format}'. Use svg, html, or json.`);
  const output = resolve(option(args, "--output") ?? defaultOutput(input, format));
  const content = format === "svg" ? renderVisualFlow(spec).svg : format === "html" ? renderStandaloneHtml(spec) : serializeVisualFlow(spec);
  await writeFile(output, content, "utf8");
  console.log(`PASS rendered ${spec.id} -> ${output}`);
}

async function inspect(input: string): Promise<void> {
  const diagram = layoutVisualFlow(await readSpec(input));
  console.log(JSON.stringify({ id: diagram.id, kind: diagram.kind, width: diagram.width, height: diagram.height, nodes: diagram.nodes.map(({ id, label, x, y, width, height, lane, group }) => ({ id, label, x, y, width, height, lane, group })) }, null, 2));
}

async function schema(args: string[]): Promise<void> {
  const content = `${JSON.stringify(VISUAL_FLOW_SCHEMA, null, 2)}\n`;
  const output = option(args, "--output");
  if (output) {
    await writeFile(resolve(output), content, "utf8");
    console.log(`PASS schema -> ${resolve(output)}`);
  } else process.stdout.write(content);
}

async function migrate(input: string, args: string[]): Promise<void> {
  const title = option(args, "--title") ?? basename(input, extname(input)).replace(/[-_]/g, " ");
  const output = resolve(option(args, "--output") ?? defaultOutput(input, "visual-flow.json"));
  const spec = migrateMermaid(await readFile(resolve(input), "utf8"), title);
  const validation = validateVisualFlow(spec);
  if (!validation.valid) throw new Error(`Migration produced an invalid diagram: ${validation.issues.map((entry) => entry.message).join("; ")}`);
  await writeFile(output, serializeVisualFlow(spec), "utf8");
  console.log(`PASS migrated ${input} -> ${output}. Review the visual narrative before publishing.`);
}

async function main(): Promise<void> {
  const [command, input, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help" || command === "-h") usage();
  if (command === "schema") return schema([input, ...args].filter(Boolean));
  if (!input) usage();
  if (command === "validate") return validate(input);
  if (command === "render") return render(input, args);
  if (command === "inspect") return inspect(input);
  if (command === "migrate-mermaid") return migrate(input, args);
  throw new Error(`Unknown command '${command}'. Run visual-flow --help.`);
}

main().catch((error: unknown) => {
  console.error(`FAIL ${error instanceof Error ? error.message : String(error)}`);
  console.error(`CLI root: ${packageRoot}`);
  process.exitCode = 1;
});
