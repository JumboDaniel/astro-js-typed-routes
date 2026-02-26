// @ts-check
import { defineConfig } from 'astro/config';
import typedRoutes from 'astro-js-typesafe-routes';

// https://astro.build/config
export default defineConfig({
  integrations: [typedRoutes()]
});
