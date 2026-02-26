import type { AstroIntegration, AstroConfig } from "astro";
import { generateRoutes } from "./codegen";
import { isPageFile } from "./utils";

export default function typedRoutes(): AstroIntegration {
  let config: AstroConfig;

  return {
    name: "astro-js-typesafe-routes",
    hooks: {
      "astro:config:setup": ({ logger }) => {
        try {
          // Injection happens in done hook
          logger.info("[astro-js-typesafe-routes] Registered");
        } catch (err) {
          logger.warn("Setup error: " + String(err));
        }
      },
      "astro:config:done": ({ config: resolved, injectTypes, logger }) => {
        try {
          injectTypes({
            filename: "types.d.ts",
            content: `/// <reference types="astro-js-typesafe-routes/typed-routes" />`
          });
          logger.info("Successfully injected types via astro:config:done hook");
        } catch(err) {
          logger.warn("Could not inject types automatically: " + String(err));
        }
        config = resolved;
        generateRoutes(config);
      },

      "astro:server:setup": ({ server, logger }) => {
        server.watcher.on("add", (path) => {
          if (isPageFile(path, config)) {
            logger.info(`[astro-js-typesafe-routes] File added, regenerating: ${path}`);
            generateRoutes(config);
          }
        });
        server.watcher.on("unlink", (path) => {
          if (isPageFile(path, config)) {
            logger.info(`[astro-js-typesafe-routes] File removed, regenerating: ${path}`);
            generateRoutes(config);
          }
        });
      },

      "astro:build:start": () => {
        generateRoutes(config);
      },
    },
  };
}
