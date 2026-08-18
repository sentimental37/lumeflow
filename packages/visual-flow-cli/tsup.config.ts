import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: { resolve: [/^@sentimental37\//] },
    sourcemap: true,
    clean: true,
    target: "node22",
    platform: "node",
    noExternal: [/^@sentimental37\//],
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    dts: false,
    sourcemap: true,
    clean: false,
    target: "node22",
    platform: "node",
    noExternal: [/^@sentimental37\//],
    banner: { js: "#!/usr/bin/env node" },
  },
]);
