import type { AstroIntegration, AstroConfig } from "astro";
import { generateRoutes } from "./codegen";
import { isPageFile } from "./utils";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

export default function typedRoutes(): AstroIntegration {
  let config: AstroConfig;

  return {
    name: "astro-js-typesafe-routes",
    hooks: {
      "astro:config:setup": ({ config: resolvedConfig, logger }) => {
        try {
          const srcDir = fileURLToPath(resolvedConfig.srcDir);
          const envDtsPath = join(srcDir, "env.d.ts");
          
          let content = "";
          if (existsSync(envDtsPath)) {
            content = readFileSync(envDtsPath, "utf-8");
          } else {
            // For tiny minimal Astro templates that don't have env.d.ts
            content = `/// <reference types="astro/client" />\n`;
          }

          const reference = `/// <reference types="astro-js-typesafe-routes/typed-routes" />`;
          if (!content.includes(reference)) {
            writeFileSync(envDtsPath, `${reference}\n${content}`, "utf-8");
            logger.info("Added types reference to src/env.d.ts");
          }
        } catch (err) {
          logger.warn("Could not inject types into src/env.d.ts automatically: " + String(err));
        }
      },
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
