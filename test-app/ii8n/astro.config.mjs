// @ts-check
import { defineConfig } from 'astro/config';
import typedRoutes from 'astro-js-typesafe-routes';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: [{
      path: "en",
      codes: ["en-US", "en-GB", "en-AU", "en-CA", "en-NG", "en-ZA"]
    }, "es", "de", "en-US", "en-GB", { path: "french", codes: ["fr", "fr-CA"] }],
  },
  integrations: [typedRoutes()]
});
