import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: { resolve: [/^@lumeflow\//] },
    sourcemap: true,
    clean: true,
    target: "node22",
    platform: "node",
    noExternal: [/^@lumeflow\//],
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    dts: false,
    sourcemap: true,
    clean: false,
    target: "node22",
    platform: "node",
    noExternal: [/^@lumeflow\//],
    banner: { js: "#!/usr/bin/env node" },
  },
]);
