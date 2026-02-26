import type { AstroConfig } from "astro";
import { fileURLToPath } from "node:url";

/**
 * Checks if a file is a page file.
 * @param filePath The path to the file.
 * @param config The Astro config.
 * @returns True if the file is a page file, false otherwise.
 */
export function isPageFile(filePath: string, config: AstroConfig): boolean {
  // filePath from Vite watcher is an absolute OS path (e.g. C:\Users\... or /Users/...)
  // config.srcDir is a file:// URL
  const pagesDirURL = new URL("pages/", config.srcDir);
  const pagesDirPath = fileURLToPath(pagesDirURL);

  // Normalize paths to ensure cross-platform compatibility (Windows vs Unix slashes)
  const normalizedFilePath = filePath.replace(/\\/g, "/");
  const normalizedPagesDir = pagesDirPath.replace(/\\/g, "/");

  return (
    normalizedFilePath.startsWith(normalizedPagesDir) &&
    /\.(astro|ts|tsx|js|jsx|md|mdx)$/.test(normalizedFilePath)
  );
}

/**
 * Converts a route segment to a route path.
 * @param segment The route segment.
 * @returns The route path.
 */
export function toRoutePath(segment: string): string {
  return segment.replace(/\[([^\]]+)\]/g, ":$1");
}

/**
 * Extracts parameters from a route segment.
 * @param segment The route segment.
 * @returns An array of parameters.
 */
export function extractParams(segment: string): string[] {
  const matches = segment.matchAll(/\[([^\]]+)\]/g);
  return [...matches].map((m) => m[1]);
}

/**
 * Strips the file extension and returns the route segment name.
 * @param filename The filename to convert (e.g. `"[slug].astro"`).
 * @returns The segment without extension (e.g. `"[slug]"`).
 * @example fileToSegment("about.astro") // → "about"
 * @example fileToSegment("[slug].astro") // → "[slug]"
 */
export function fileToSegment(filename: string): string {
  return filename.replace(/\.(astro|ts|tsx|js|jsx|md|mdx)$/, "");
}

/**
 * Checks if a route segment is dynamic (contains a parameter).
 * @param segment The route segment to check.
 * @returns `true` if the segment is dynamic.
 * @example isDynamic("[slug]") // → true
 * @example isDynamic("about") // → false
 */
export function isDynamic(segment: string): boolean {
  return segment.startsWith("[") && segment.endsWith("]");
}

/**
 * Checks if a route segment is a catch-all parameter.
 * @param segment The route segment to check.
 * @returns `true` if the segment is a catch-all.
 * @example isCatchAll("[...slug]") // → true
 * @example isCatchAll("[slug]") // → false
 */
export function isCatchAll(segment: string): boolean {
  return segment.startsWith("[...") && segment.endsWith("]");
}

/**
 * Checks if a segment represents an index route.
 * @param segment The route segment to check.
 * @returns `true` if the segment is `"index"`.
 */
export function isIndex(segment: string): boolean {
  return segment === "index";
}
