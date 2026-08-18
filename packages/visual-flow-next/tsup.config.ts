import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.tsx",
    client: "src/client.tsx",
  },
  format: ["esm", "cjs"],
  dts: { resolve: [/^@lumeflow\//] },
  sourcemap: true,
  clean: true,
  target: "es2022",
  splitting: false,
  external: ["react", "react-dom", "react/jsx-runtime", "next", "@lumeflow/react"],
  noExternal: ["@lumeflow/core"],
});
