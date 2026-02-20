import { describe, it, expect } from "vitest";
import { $path } from "./path";

describe("$path", () => {
  it("resolves simple paths", () => {
    expect($path({ to: "/about" })).toBe("/about");
  });

  it("resolves dynamic params", () => {
    expect($path({ to: "/blog/[slug]", params: { slug: "hello" } })).toBe(
      "/blog/hello",
    );
  });

  it("handles multiple params", () => {
    expect(
      $path({
        to: "/blog/[category]/[slug]",
        params: { category: "tech", slug: "astro" },
      }),
    ).toBe("/blog/tech/astro");
  });

  it("handles locale prefix", () => {
    expect($path({ to: "/about", locale: "fr" })).toBe("/fr/about");
  });

  it("handles search params", () => {
    expect($path({ to: "/search", search: { q: "react", sort: "desc" } })).toBe(
      "/search?q=react&sort=desc",
    );
  });

  it("handles empty search params", () => {
    expect($path({ to: "/search", search: {} })).toBe("/search");
  });

  it("handles hash", () => {
    expect($path({ to: "/about", hash: "team" })).toBe("/about#team");
  });

  it("combines everything", () => {
    expect(
      $path({
        to: "/blog/[slug]",
        params: { slug: "post-1" },
        locale: "en",
        search: { sort: "asc" },
        hash: "comments",
      }),
    ).toBe("/en/blog/post-1?sort=asc#comments");
  });
});
