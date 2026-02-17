/**
 * Options for building a URL via `$path()`.
 *
 * At the source level, `to` is a loose `string`. The generated
 * `declare module` override narrows it to a union of actual route IDs.
 */
export type RouteOptions = {
  /** The route path to navigate to (e.g. `"/about"` or `"/blog/[slug]"`). */
  to: string;
  /** Dynamic params for the route (e.g. `{ slug: "hello" }`). */
  params?: Record<string, string>;
  /** Locale prefix for i18n (e.g. `"fr"` → `/fr/about`). */
  locale?: string;
  /** Search/query params (e.g. `{ page: "2" }` → `?page=2`). */
  search?: Record<string, string>;
  /** URL hash fragment (e.g. `"comments"` → `#comments`). */
  hash?: string;
};

/**
 * Builds a fully-resolved URL string from route options.
 *
 * Steps: replace `[param]` segments → prepend locale → append search → append hash.
 *
 * @example
 * $path({ to: "/about" })  // → "/about"
 *
 * @example
 * $path({ to: "/blog/[slug]", params: { slug: "hello" }, locale: "fr" })
 * // → "/fr/blog/hello"
 *
 * @example
 * $path({ to: "/about", search: { ref: "nav" }, hash: "team" })
 * // → "/about?ref=nav#team"
 */
export function $path(opts: RouteOptions): string {
  let path = opts.to;

  if (opts.params) {
    for (const [key, value] of Object.entries(opts.params)) {
      path = path.replace(`[${key}]`, value);
    }
  }

  if (opts.locale) {
    path = `/${opts.locale}${path}`;
  }

  if (opts.search && Object.keys(opts.search).length > 0) {
    const searchParams = new URLSearchParams(opts.search);
    path = `${path}?${searchParams.toString()}`;
  }

  if (opts.hash) {
    path = `${path}#${opts.hash}`;
  }

  return path;
}
