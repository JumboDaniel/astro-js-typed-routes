import type { AstroGlobal, GetStaticPaths } from "astro";
import { $path, type RouteOptions } from "./path";

/** Shorthand for `AstroGlobal` with all generics set to `any`. */
type AstroAny = AstroGlobal<any, any, any>;

/**
 * Creates a route helper bound to a specific route ID.
 *
 * At the source level, types are loose. The generated `declare module`
 * override narrows `routeId` to valid routes and types `getParams()`
 * return values, `redirect()`/`rewrite()` destinations, etc.
 *
 * @example
 * ```ts
 * const Route = createRoute({ routeId: "/blog/[slug]" });
 * const { slug } = Route.getParams(Astro);
 * ```
 */
export function createRoute(_opts: { routeId: string }) {
  return {
    /** Returns `Astro.params`. */
    getParams: (astro: AstroAny) => {
      return astro.params;
    },

    /** Returns `Astro.props`. */
    getProps: (astro: AstroAny) => {
      return astro.props;
    },

    /** Type-safe redirect — builds URL via `$path()`. */
    redirect: (astro: AstroAny, link: RouteOptions) => {
      return astro.redirect($path(link));
    },

    /** Type-safe rewrite — builds URL via `$path()`. */
    rewrite: (astro: AstroAny, link: RouteOptions) => {
      return astro.rewrite($path(link));
    },

    /** Identity function that type-checks `getStaticPaths` params. */
    createGetStaticPaths: (fn: GetStaticPaths): GetStaticPaths => {
      return fn;
    },
  };
}
