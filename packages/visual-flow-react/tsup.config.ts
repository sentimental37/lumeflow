import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: [/^@lumeflow\//] },
  sourcemap: true,
  clean: true,
  target: "es2022",
  external: ["react", "react-dom"],
  noExternal: [/^@lumeflow\//],
});
