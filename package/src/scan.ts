import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileToSegment, isIndex, extractParams } from "./utils.js";

export type PageNode = {
  routePath: string;   
  params: string[];    
};

const IGNORE = /^_|^404\.|^500\./;

// Extensions that are valid route files
const ROUTE_EXT = /\.(astro|ts|tsx|js|jsx|md|mdx)$/;

export function scanPages(pagesDir: string): PageNode[] {
  const results: PageNode[] = [];
  walk(pagesDir, pagesDir, results);
  return results;
}

function walk(root: string, dir: string, results: PageNode[]): void {
  let entries: string[];

  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    // skip underscore files/folders and special pages
    if (IGNORE.test(entry)) continue;

    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // skip api routes — those are endpoints not pages
      if (entry === "api") continue;
      walk(root, fullPath, results);
      continue;
    }

    // skip non-route files
    if (!ROUTE_EXT.test(entry)) continue;

    const segment = fileToSegment(entry);

    // build the route path relative to pages dir
    const relDir = relative(root, dir);
    const segments = relDir
      ? [...relDir.split("/"), segment]
      : [segment];

    // "index" at any level just means the parent path
    const routeSegments = isIndex(segment)
      ? segments.slice(0, -1)
      : segments;

    // root index → "/"
    const routePath = routeSegments.length === 0
      ? "/"
      : "/" + routeSegments.join("/");

    results.push({
      routePath,
      params: extractParams(routePath),
    });
  }
}