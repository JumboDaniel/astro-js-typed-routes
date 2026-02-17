import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        path: resolve(__dirname, "src/path.ts"),
        "create-route": resolve(__dirname, "src/create-route.ts"),
        link: resolve(__dirname, "src/components/link.tsx"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "astro",
        "react",
        "react/jsx-runtime",
        "node:fs",
        "node:path",
        "node:url",
        "fs",
        "path",
      ],
    },
    target: "node18",
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
