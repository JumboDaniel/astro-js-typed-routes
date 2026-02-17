import type { AstroIntegration, AstroConfig } from "astro";
import { generateRoutes } from "./codegen";
import { isPageFile } from "./utils";

export default function typedRoutes(): AstroIntegration {
  let config: AstroConfig;

  return {
    name: "astro-typed-routes",
    hooks: {
      "astro:config:done": ({ config: resolved }) => {
        config = resolved;
        generateRoutes(config);
      },

      "astro:server:setup": ({ server }) => {
        server.watcher.on("add", (path) => {
          if (isPageFile(path, config)) generateRoutes(config);
        });
        server.watcher.on("unlink", (path) => {
          if (isPageFile(path, config)) generateRoutes(config);
        });
      },

      "astro:build:start": () => {
        generateRoutes(config);
      },
    },
  };
}